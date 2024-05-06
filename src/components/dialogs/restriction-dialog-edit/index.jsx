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

const RestrictionDialogEdit = ({ open, setOpen, title, editId, tableType, editTableName, isActiveTable }) => {
  // States
  const [tableData, setTableData] = useState([]);
  const [dataForRestrictioncondition, setDataForRestrictioncondition] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false);
  const [insertPermissionData, setinsertPermissionData] = useState([]);
  const [roleFormData, setRoleFormData] = useState([]);
  const [editRestrictionTable, setEditRestrictionTable] = useState([]);
  const [CheckedState, setCheckedState] = useState();
  const [editRestrictionDataArray, setEditRestrictionDataArray] = useState([]);
  const [viewRestrictionTables, setViewRestrictionTable] = useState([]);

  useEffect(() => {
    
    const editTableRestrictions = (id, type, tableName, is_active) => {
      debugger;
      
      const newis_active = is_active === '1' ? false : true;
      const editData = [];

      editData.push({ Tables: tableName, type: type, is_active: newis_active, id: id });

      const editValues = [];

      const selectedEditrestriction = editData.map((item) => ({
        ...editValues,
        [item.Tables]: {
          ...editValues[item.Tables],
          ['remove']: item.is_active, ['type']: item.type, ['id']: item.id
        },
      }));

      const isRemoved = is_active === '0' ? true : false;

      setCheckedState(isRemoved);

      setEditRestrictionTable(selectedEditrestriction);

    };

    editTableRestrictions(editId, tableType, editTableName, isActiveTable);
    loadViewRestrictionTable('easy_outdesk');
  }, [editId, tableType, editTableName, isActiveTable]);

  const handleClose = () => {
    setOpen(false);
  }

  const toggleCheckedState = () => {
    setCheckedState(!CheckedState);
  };

  const handleEditRestrictionCheckboxChange = (index, tableName, table, CheckedState) => {
    const newDataArray = {
      id: table[tableName].id,
      checkedState: CheckedState
    };

    setEditRestrictionDataArray(newDataArray);
    console.log(newDataArray);


  };

  const loadViewRestrictionTable = async (schemaName) => {
    debugger;

    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getViewRestrictionTable/${schemaName}`);

      setViewRestrictionTable(response.data);


    } catch (error) {
      console.error('Error loading table');
    }
  };

  const handleRestrictionCheckboxChange = (index) => {
    //debugger;
    setDataForRestrictioncondition((prevData) => {
      const updatedData = [...prevData];
      const tableName = Object.keys(updatedData[index])[0];

      updatedData[index][tableName].remove = true;
      
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




  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("view restriction submit", dataForRestrictioncondition);

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/updateRestrictionData', {
        database: 'easy_outdesk',
        username: 'super admin',
        UpdatedPermissionData: editRestrictionDataArray
      });



    } catch (error) {

      console.error(error);

    }
  }





  return (
    <Dialog fullWidth maxWidth='md' scroll='body' open={open} onClose={handleClose}>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center pbs-10 pbe-6 pli-10 sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {'Edit Restriction'}
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
              <tbody>
                {editRestrictionTable.map((table, index) => {
                  const tableName = Object.keys(table)[0];
                  const insertedData = viewRestrictionTables.find(data => data.tables === tableName);
                  const isRemoved = insertedData ? insertedData.is_active === '0' : false;// Assuming 'tables' is the property representing the table name

                  
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
                                onChange={() => {
                                  toggleCheckedState();
                                  handleEditRestrictionCheckboxChange(index, tableName, table, CheckedState);
                                }}
                                checked={CheckedState} />
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
          <Button variant='contained' type='submit' onClick={handleClose}>Update</Button>
          <Button variant='outlined' type='reset' color='secondary' onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RestrictionDialogEdit;
