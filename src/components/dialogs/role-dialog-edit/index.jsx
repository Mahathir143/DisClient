import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, TextField, Checkbox, FormGroup, FormControlLabel, DialogActions, Button } from '@mui/material';

import tableStyles from '@core/styles/table.module.css';

const RoleDialog = ({ open, setOpen, title, editId, retrievedRoleData, editPermissionData }) => {
  const [selectedSchema, setSelectedSchema] = useState();
  const [tableData, setTableData] = useState([]);
  const [insertPermissionData, setInsertPermissionData] = useState({});
  const [roleFormData, setRoleFormData] = useState({});
  const [retrievedPermissionData, setRetrievedPermissionData] = useState([]);

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

    fetchTables();
  }, []);

  useEffect(() => {
    if (retrievedRoleData && retrievedRoleData.length > 0) {
      setRoleFormData(retrievedRoleData[0]);
    }

    if (editPermissionData && editPermissionData.length > 0) {
      setRetrievedPermissionData(editPermissionData);
    }
  }, [retrievedRoleData, editPermissionData]);

  const handleClose = () => {
    setOpen(false);
  }

  const handleAddRoleChange = (key, value) => {
    setRoleFormData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  /* const handleEditPermissionCheckboxChange = (tableName, operation) => {
    setRetrievedPermissionData(prevPermissions => {
      const updatedPermissions = prevPermissions.map(permission => {
        if (permission.table === tableName) {
          return {
            ...permission,
            [operation]: permission[operation] === 1 ? 0 : 1,
          };
        }
        return permission;
      });
      return updatedPermissions;
    });
  }; */

  const handleEditPermissionCheckboxChange = (tableName, operation) => {
    console.log('edit perm', retrievedPermissionData);

    const isTableExists = retrievedPermissionData.some((item) => item.table === tableName);

    if (isTableExists) {
      setRetrievedPermissionData((prevPermissions) => {
        const updatedPermissions = prevPermissions.map((permission) => {
          if (permission.table === tableName) {
            return {
              ...permission,
              [operation]: permission[operation] === 1 ? 0 : 1,
            };
          }

          
return permission;
        });

        return updatedPermissions;
      });
    } else {
      // If the table does not exist, add it to the permissions array
      setRetrievedPermissionData((prevPermissions) => [
        ...prevPermissions,
        {
          table: tableName,
          create: 0,
          read: 0,
          update: 0,
          delete: 0,
          [operation]: 1,
        },
      ]);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('edit permission data', retrievedPermissionData);

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/insertRoleandPermissionData', {
        database: 'easy_outdesk',
        Rolecolumns: Object.keys(roleFormData),
        Rolevalues: Object.values(roleFormData),
        EditroleColumns: Object.keys(roleFormData),
        EditroleValues: Object.values(roleFormData),
        username: 'userName',
        PermissionData: insertPermissionData,
        EditPermissionData: retrievedPermissionData,
        editClick: true,
        PermissionId: editId
      });

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog fullWidth maxWidth='md' scroll='body' open={open} onClose={handleClose}>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center pbs-10 pbe-6 pli-10 sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {'Edit Role'}
        <Typography component='span' className='flex flex-col text-center'>Set Role Permissions</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className='overflow-visible pbs-0 pbe-6 pli-10 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>

          <TextField
            label='Role Name'
            variant='outlined'
            fullWidth
            placeholder='Enter Role Name'
            value={roleFormData.Rolename}
            onChange={(e) => handleAddRoleChange("Rolename", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            style={{ marginTop: '20px' }}
            label='Role Code'
            variant='outlined'
            fullWidth
            placeholder='Enter Role Code'
            value={roleFormData.Rolecode}
            onChange={(e) => handleAddRoleChange("Rolecode", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Typography variant='h5' className='plb-6'>Role Permissions</Typography>
          <div className='flex flex-col overflow-x-auto'>
            <table className={tableStyles.table}>
              <tbody>
                {tableData.map((table, index) => (
                  <tr key={index}>
                    <th className='pis-0'>
                      <Typography className='font-medium whitespace-nowrap flex-grow min-is-[225px]' color='text.primary'>{table.Tables}</Typography>
                    </th>
                    <td className='!text-end pie-0'>
                      <FormGroup className='flex-row gap-6 flex-nowrap justify-end'>
                        {['create', 'read', 'update', 'delete'].map(permission => (
                          <FormControlLabel
                            key={permission}
                            className='mie-0'
                            control={
                              <Checkbox
                                onChange={() => handleEditPermissionCheckboxChange(table.Tables, permission)}
                                checked={editPermissionData !== undefined && retrievedPermissionData.length > 0 ?
                                  retrievedPermissionData.some(tab => tab.table === table.Tables) &&
                                  retrievedPermissionData.find(tab => tab.table === table.Tables)[permission] === 1 : null}
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
          <Button variant='contained' type='submit' onClick={handleClose}>Update</Button>
          <Button variant='outlined' type='reset' color='secondary' onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default RoleDialog;
