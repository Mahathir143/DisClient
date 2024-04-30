// React Imports
import { useState, useEffect } from 'react'
import axios from 'axios';

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

import RoleDialogEdit from '../role-dialog-edit';

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const RoleDialog = ({ open, setOpen, title }) => {
  // States
  const [tableData, setTableData] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState();
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false);
  const [insertPermissionData, setinsertPermissionData] = useState([]);
  const [roleFormData, setRoleFormData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [editId, setEditId] = useState();
  const [editPermissionData, setEditPermissionData] = useState([]);
  const [retrievedRoleData, setretrievedRoleData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [isEditClick, setIsEditClick] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    const storedSchema = localStorage.getItem("company");
    setSelectedSchema(storedSchema);
    const fetchTables = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getTables/${storedSchema}`);

        const tables = response.data;

        const executables = await loadStoredProcedure();
        const externalLinks = await loadExternalLinks();
        const others = await loadOthers();

        const menus = [...tables, ...executables, ...externalLinks, ...others];



        setTableData(menus);
        console.log('tables in role', response.data);
      } catch (error) {
        console.error('Error loading tables:', error);
      }
    };

    const loadStoredProcedure = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getExecutableTables/${storedSchema}`);
        const tablesArray = response.data;
        console.log('ExecuteblesRes', tablesArray);
        const executebles = tablesArray.map((item) => ({
          TABLE_COMMENT: item.name,
          Tables: item.name,
          haveId: 1,
        }));
        console.log('Executebles', executebles);

        return executebles
      } catch (error) {
        console.error('Error loading tables:', error);
      }
    };

    const loadExternalLinks = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getExternalLinks/${storedSchema}`);
        const tablesArray = response.data;
        /* const externalLinks = tablesArray.map((item) => ({
          Tables: item,
          haveId: 1,
          type: 'EL'
        })); */
        const externalLinksFilter = tablesArray.map((item) => ({
          TABLE_COMMENT: item.menu,
          Tables: item.menu,
          haveId: 1
        }));
        console.log('external TRANSFORMED', externalLinksFilter);

        //setExternalLinks(transformedData);
        return externalLinksFilter
      } catch (error) {
        console.error('Error loading tables:', error);
      }
    };

    const loadOthers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getTableOthers/${storedSchema}`);
        const tablesArray = response.data;
        console.log('OthersRes', tablesArray);

        const OthersFilter = tablesArray.map((item) => ({
          TABLE_COMMENT: item.menu,
          Tables: item.name,
          haveId: 1
        }));

        //transformedData.unshift({ "sectionTitle": "Others" });
        console.log('Others table', OthersFilter);

        return OthersFilter



      } catch (error) {
        console.error('Error loading tables:', error);
      }
    };

    const loadRoleTable = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getRoleTable/${storedSchema}`);
        setRoleData(response.data);
        console.log("role:", response.data);
      } catch (error) {
        console.log('Error loading role table', error);
      }
    };

    loadRoleTable();
    fetchTables();

  }, []);

  const handleClose = () => {
    setOpen(false);
  }

  const handleAddRolechange = async (key, value) => {

    if (key === 'Rolename') {
      const editId = roleData.filter((item) => item.Rolename === value);
      if (editId.length > 0) {
        console.log("role", roleData);
        // console.log('role id', editId[0].id);
        const newValue = editId[0].id;
        setEditId(newValue);
        setIsEditClick(true);
        setOpenEditDialog(true);

        console.log("roleId", newValue);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getRolePermissionData/${'easy_outdesk'}/${newValue}`);


        const filteredPermission = response.data.map((item) => {
          const { Rolename, Rolecode, ...rest } = item;
          return rest;

        });
        setEditPermissionData(filteredPermission);

        console.log("combined data", filteredPermission);

        const filteredData = response.data[0];
        const retrievedRoleData = [
          { Rolename: filteredData.Rolename, Rolecode: filteredData.Rolecode }
        ];
        setretrievedRoleData(retrievedRoleData);

        console.log('Retrieved role data', retrievedRoleData);
      }

    }

    setRoleFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));

  };

  const handleCheckboxChange = (tableName, operation) => {
    setinsertPermissionData((prevPermissions) => {
      const updatedPermissions = { ...prevPermissions };

      // If the table doesn't exist in prevPermissions, initialize it with all permissions as false
      if (!updatedPermissions[tableName]) {
        updatedPermissions[tableName] = {
          create: false,
          read: false,
          edit: false,
          delete: false
        };
      }

      // Toggle the selected permission
      updatedPermissions[tableName][operation] = !updatedPermissions[tableName][operation];

      // Update selectedPermissions state
      setSelectedPermissions({
        ...selectedPermissions,
        [tableName]: updatedPermissions[tableName]
      });

      return updatedPermissions;
    });
  };


  const handleSelectAll = () => {
    const updatedPermissions = {};
    tableData.forEach((table) => {
      updatedPermissions[table.Tables] = {
        create: true,
        read: true,
        edit: true,
        delete: true
      };
    });

    // Update both insertPermissionData and selectedPermissions synchronously
    setinsertPermissionData(updatedPermissions, () => {
      setSelectedPermissions(updatedPermissions);
    });

    setSelectAllChecked(!selectAllChecked);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('permissions test:', insertPermissionData);
    /* try {
      const response = await axios.post(process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/insertRoleandPermissionData', {
        database: 'easy_outdesk',
        Rolecolumns: Object.keys(roleFormData),
        Rolevalues: Object.values(roleFormData),
        EditroleColumns: insertPermissionData,
        EditroleValues: insertPermissionData,
        username: 'userName',
        PermissionData: insertPermissionData,
        editClick: false,
        PermissionId: 2
      });

    } catch (error) {
      console.error(error);

    } */

  }

  useEffect(() => {
    // Place the logic that needs to run after insertPermissionData changes here
    console.log('insertPermissionData changed:', insertPermissionData);
    // Any other relevant logic can go here
  }, [insertPermissionData]);




  return (

    <Dialog fullWidth maxWidth='md' scroll='body' open={open} onClose={handleClose}>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center pbs-10 pbe-6 pli-10 sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {title ? 'Edit Role' : 'Add Role'}
        <Typography component='span' className='flex flex-col text-center'>Set Role Permissions</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className='overflow-visible pbs-0 pbe-6 pli-10 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <TextField label='Role Name' variant='outlined' fullWidth placeholder='Enter Role Name' defaultValue={title} onChange={(e) => handleAddRolechange("Rolename", e.target.value)} />
          <TextField style={{ marginTop: '20px' }} label='Role Code' variant='outlined' fullWidth placeholder='Enter Role Code' defaultValue={title} onChange={(e) => handleAddRolechange("Rolecode", e.target.value)} />
          <Typography variant='h5' className='plb-6'>Role Permissions</Typography>

          <div className='flex flex-col overflow-x-auto'>
            <table className={tableStyles.table}>
              <FormControlLabel

                control={
                  <Checkbox
                    onChange={handleSelectAll}
                  //checked={selectedPermissions[table.Tables]?.[permission]}
                  />
                }
                label={'Select All'}
              />
              <tbody>
                {tableData.map((table, index) => (
                  <tr key={index}>
                    <th className='pis-0'>
                      <Typography className='font-medium whitespace-nowrap flex-grow min-is-[225px]' color='text.primary'>{table.Tables}</Typography>
                    </th>
                    <td className='!text-end pie-0'>
                      <FormGroup className='flex-row gap-6 flex-nowrap justify-end'>
                        {['create', 'read', 'edit', 'delete'].map((permission) => (
                          <FormControlLabel
                            key={permission}
                            className='mie-0'
                            control={
                              <Checkbox
                                onChange={() => handleCheckboxChange(table.Tables, permission)}
                                checked={selectAllChecked || insertPermissionData[table.Tables]?.[permission]} // Check selectAllChecked first
                                indeterminate={insertPermissionData[table.Tables]?.[permission]}
                              />
                            }
                            label={permission}
                          />
                        ))}
                      </FormGroup>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>
          </div>
        </DialogContent>
        <DialogActions className='gap-2 justify-center pbs-0 pbe-10 pli-10 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit' onClick={handleClose}>Submit</Button>
          <Button variant='outlined' type='reset' color='secondary' onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </form>
      <div>
        <RoleDialogEdit open={openEditDialog} setOpen={setOpenEditDialog} editId={editId} retrievedRoleData={retrievedRoleData} editPermissionData={editPermissionData} />
      </div>
    </Dialog>
  )
}

export default RoleDialog;
