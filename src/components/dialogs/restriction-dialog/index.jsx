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

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const RestrictionDialog = ({ open, setOpen, title }) => {
  // States
  const [tableData, setTableData] = useState([]);
  const [dataForRestrictioncondition, setDataForRestrictioncondition] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false);
  const [insertPermissionData, setinsertPermissionData] = useState([]);
  const [roleFormData, setRoleFormData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    const fetchTables = async (schemaName) => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getTables/${schemaName}`);

        const tablesArray = response.data;


        const newTables = tablesArray.map((item) => ({
          TableComment: item.TABLE_COMMENT,
          Tables: item.Tables,
          haveId: item.haveId,
          type: 'T'
        }));

        const loadedOtherTable = await loadTableOthers(schemaName);

        const othersTable = loadedOtherTable.map((item) => ({
          Tables: item.name,
          Require_newTab: item.req_new_tab,
          type: 'OT'
        }));



        const loadedExecuteMenu = await loadExecuteMenu(schemaName);

        const loadedExternalLinks = await loadExternalLinks(schemaName);


        const extLinksArray = loadedExternalLinks.map((item) => item.menu);
        const arrayofExternalLinks = extLinksArray.map((item) => ({
          TableComment: '',
          Tables: item,
          haveId: 1,
          type: 'EL'
        }));



        const addedTables = [...newTables, ...arrayofExternalLinks, ...loadedExecuteMenu, ...othersTable];

        /* 
                if (roleCode !== 'SA') {
                  const activeViewTables = viewTable.filter((table) => table.is_active === '1');
        
                  const onlyActiveTables = activeViewTables.map((table) => ({
                    Tables: table.tables
                  }));
        
                  const filterAddedTables = addedTables.filter((item) => {
                    // Check if the tables property of the item is present in onlyActiveTables
                    return onlyActiveTables.some((table) => table.Tables === item.Tables);
                  });
        
        
                  setNewTables(filterAddedTables);
                } else {
                  setNewTables(addedTables);
                } */

        const onlyTables = addedTables.map((item) => ({ Tables: item.Tables, type: item.type }));

        const prevData = [];
        const tableswithCondition = onlyTables.map((item) => ({
          ...prevData,
          [item.Tables]: {
            ...prevData[item.Tables],
            ['remove']: false, ['type']: item.type
          },
        }));


        setDataForRestrictioncondition(tableswithCondition);

        console.log('tables with condition', tableswithCondition);
      } catch (error) {
        console.error('Error loading tables:', error);
      }
    };

    fetchTables('easy_outdesk');
  }, []);

  const handleClose = () => {
    setOpen(false);
  }

  const loadTableOthers = async (schemaName) => {
    try {

      const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getTableOthers/${schemaName}`);
      // Return the data to be used in loadTables
      return response.data;
    } catch (error) {
      console.error('Error loading others table:', error);
      // Ensure to handle errors or return a default value
      return null;
    }
  };

  /* const handleRestrictionCheckboxChange = (index) => {
    setDataForRestrictioncondition((prevData) => {
      const updatedData = [...prevData];
      const tableName = Object.keys(updatedData[index])[0];
      // Toggle the 'remove' property between true and false
      updatedData[index][tableName].remove = !updatedData[index][tableName].remove;
      return updatedData;
    });
  }; */


  const loadExecuteMenu = async (schemaName) => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getExecutableTables/${schemaName}`);
      console.log(response.data);


      const executableArray = response.data.map((item) => item.name);
      console.log("execute tables", executableArray);
      const newExecutablesArray = executableArray.map((item) => ({
        TableComment: '',
        Tables: item,
        haveId: 1,
        type: 'E'
      }));

      return newExecutablesArray;

    } catch (error) {
      console.error('Error getting execute menu');
    }
  };

  const loadExternalLinks = async (schemaName) => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getExternalLinks/${schemaName}`);

      console.log('ext links', response.data);
      const extLinksArray = response.data.map((item) => item.menu);
      const arrayofExternalLinks = extLinksArray.map((item) => ({
        Tables: item,
        haveId: 1,
        type: 'EL'
      }));

      return response.data; // Return the array of external links
    } catch (error) {
      console.error('Error getting External links table', error);
      // Handle the error or return an empty array if needed
      return [];
    }
  };

  const handleRestrictionCheckboxChange = (index) => {
    setDataForRestrictioncondition((prevData) => {
      const updatedData = [...prevData];
      const tableName = Object.keys(updatedData[index])[0];
      // Toggle the 'remove' property between true and false
      updatedData[index][tableName].remove = !updatedData[index][tableName].remove;
      return updatedData;
    });
  };


  const handleAddRolechange = (key, value) => {
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
    setDataForRestrictioncondition((prevData) => {
      const updatedData = prevData.map((table) => {
        const tableName = Object.keys(table)[0];
        return {
          [tableName]: {
            ...table[tableName],
            remove: !selectAllChecked // Toggle the 'remove' property based on selectAllChecked
          }
        };
      });
      return updatedData;
    });
    setSelectAllChecked(!selectAllChecked); // Toggle the selectAllChecked state
  };





  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("view restriction submit", dataForRestrictioncondition);
    /* try {
      const response = await axios.post(process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/insertRestrictionData', {
        database: 'easy_outdesk',
        username: 'super admin',
        PermissionData: dataForRestrictioncondition
      });



    } catch (error) {

      console.error(error);aaa

    } */

  }



  return (
    <Dialog fullWidth maxWidth='md' scroll='body' open={open} onClose={handleClose}>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center pbs-10 pbe-6 pli-10 sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {'Add Restrictions'}
        <Typography component='span' className='flex flex-col text-center'>Set Role Permissions</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className='overflow-visible pbs-0 pbe-6 pli-10 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          {/* <TextField label='Select Schema' variant='outlined' fullWidth placeholder='Schema' defaultValue={title} /> */}
          <Typography variant='h5' className='plb-6'>View Restrictions</Typography>
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
                {dataForRestrictioncondition.map((table, index) => {
                  const tableName = Object.keys(table)[0];
                  return (
                    <tr key={index}>
                      <th className='pis-0'>
                        <Typography className='font-medium whitespace-nowrap flex-grow min-is-[225px]' color='text.primary'>{tableName}</Typography>
                      </th>
                      <td className='!text-end pie-0'>
                        <FormGroup className='flex-row gap-6 flex-nowrap justify-end'>
                          <FormControlLabel
                            key="remove"
                            className='mie-0'
                            control={
                              <Checkbox
                                onChange={() => handleRestrictionCheckboxChange(index, tableName)}
                                checked={table[tableName]["remove"]} // Check the 'remove' property of the current table object
                                indeterminate={table[tableName]["remove"]} // Indeterminate logic as per your requirement
                              />
                            }
                            label="remove"
                          />
                        </FormGroup>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>

          </div>
        </DialogContent>
        <DialogActions className='gap-2 justify-center pbs-0 pbe-10 pli-10 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit' onClick={handleClose}>Submit</Button>
          <Button variant='outlined' type='reset' color='secondary' onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RestrictionDialog;
