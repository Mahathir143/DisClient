// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import axios from 'axios';

// Vars
const initialData = {
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  contact_no: '',
  Rolename: ''
};

const AddUserDrawer = ({ open, handleClose, editUserdata, editClick, setIsEditClick, onSubmissionSuccess }) => {
  // States
  const [formData, setFormData] = useState(initialData);
  const [passError, setPassError] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState();

  console.log('edit user', editUserdata);

  // Effect to update newEditUserData when editUserdata changes
  useEffect(() => {
    if (editUserdata) {
      setFormData(editUserdata);
    }
  }, [editUserdata]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.confirm_password !== formData.password) {
      setPassError(true);

      return;
    } else {
      handleClose();
      console.log('edit', formData);
      debugger;
      const UpdatedroleId = roleData.filter(item => item.Rolename === formData.Rolename);

      if (!editClick) {
        try {
          const response = await axios.post(
            process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/insertUserData',
            {
              database: 'easy_outdesk',
              Username: formData.username,
              email: formData.email,
              password: formData.confirm_password,
              ContactNo: formData.contact_no,
              roleId: UpdatedroleId[0].id
            }
          );

          onSubmissionSuccess(true);
          console.log('Response:', response.data);
        } catch (error) {
          console.error('Error:', error);
          onSubmissionSuccess(false);
        }
      } else {
        try {
          const response = await axios.post(
            process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/UpdateUserData',
            {
              database: 'easy_outdesk',
              EditUsername: formData.username,
              EditEmail: formData.email,
              EditContactNo: formData.contact_no,
              EditRoleId: UpdatedroleId[0].id,
              EditUserId: editUserdata.id,
              isEditClick: editClick
            }
          );

          console.log('Response:', response.data);
        } catch (error) {
          console.error('Error:', error);
        }
      }

    }
  };

  const loadRoleTable = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getRoleTable/${'easy_outdesk'}`);

      setRoleData(response.data);
      console.log("role:", response.data);
    } catch (error) {
      console.log('Error loading role table', error);
    }
  };

  const handleReset = () => {
    handleClose();
    setIsEditClick(false);
    setFormData(initialData);
  };



 /*  useEffect(() => {
    if (submitSuccess !== undefined) {
      onSubmissionSuccess(submitSuccess);
    }
  }, [submitSuccess, onSubmissionSuccess]); */


  useEffect(() => {
    loadRoleTable();
  }, []);

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >

      <div className='flex items-center justify-between pli-5 plb-[15px]'>
        <Typography variant='h5'>{editClick === true ? "Edit User" : "Add New User"}</Typography>
        <IconButton onClick={handleReset}>
          <i className='ri-close-line' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

          <TextField
            label='Username'
            fullWidth
            placeholder='johndoe'
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
          />

          <TextField
            label='Email'
            fullWidth
            placeholder='johndoe@gmail.com'
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          {!editClick && (
            <>
              <TextField
                label='Password'
                fullWidth
                type='password'
                placeholder='Enter password'
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
              <TextField
                label='Confirm Password'
                error={passError}
                type='password'
                fullWidth
                placeholder='Enter password'
                onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
                helperText={passError && "Password and Confirm password should be same"}
              />
            </>
          )}

          <TextField
            label='Contact'
            fullWidth
            placeholder='Enter contact number'
            value={formData.contact_no}
            onChange={e => setFormData({ ...formData, contact_no: e.target.value })}
          />

          <FormControl fullWidth>
            <InputLabel id='role-select'>Select Role</InputLabel>
            <Select
              fullWidth
              id='select-role'
              value={formData.Rolename} // Set the value to formData.role (assuming role field exists in formData)
              onChange={e => {
                const selectedRoleId = e.target.value;

                setFormData({ ...formData, Rolename: selectedRoleId }); // Update role field to store the role's ID
              }}
              label='Select Role'
              labelId='role-select'
              inputProps={{ placeholder: 'Select Role' }}
            >
              {roleData && roleData.map((item) => (
                <MenuItem key={item.id} value={item.Rolename}>{item.Rolename}</MenuItem>
              ))}
            </Select>



          </FormControl>

          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button variant='outlined' color='error' type='reset' onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default AddUserDrawer;
