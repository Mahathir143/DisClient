'use client'
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation'; // Import hooks from next/navigation
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Table from '@components/table/page';
import MUItable2 from '@components/MUItable2/page';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import FormLayoutsBasic from '../../form/page';
import axios from 'axios';

const MUITable = () => {
  const pathname = usePathname(); // Use usePathname() hook
  const searchParams = useSearchParams(); // Use useSearchParams() hook

  const [selectedSchema, setSelectedSchema] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState([]);
  const [retrievedEditData, setRetrievedEditData] = useState([]);
  const [IsEdit, setIsEdit] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [crudPermissions, setCrudPermissions] = useState([]);
  const [showAddbutton, setShowAddbutton] = useState();
  const [tableCrud, setTableCrud] = useState([]);

  useEffect(() => {
    debugger;
    const id = searchParams.get('id'); // Use searchParams to get 'id'
    console.log('table name id', id);
    if (id) {
      //const storedLink = localStorage.getItem(id);
      const storedSchema = localStorage.getItem('company');




      console.log('schema name', storedSchema);
      if (id) {
        setSelectedTable(id);
      }
      if (storedSchema) {
        setSelectedSchema(storedSchema);
        loadRoleTable(storedSchema, id);
      }
    }
  }, [searchParams]); // Add searchParams to the dependency array

  useEffect(() => {
    if (selectedTable && selectedSchema) {
      loadFields(selectedTable, selectedSchema);
    }
  }, [selectedTable, selectedSchema]);

  const loadFields = async (tableName, schema) => {
    debugger;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getFields/${schema}/${tableName}`
      );
      setFields(response.data);
      console.log('fields', response.data);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const loadPermissionTable = async (schemaName, id) => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getPermissionTable/${schemaName}/${id}`);
      setCrudPermissions(response);
      //console.log("Permission table data", response.data);
      return response.data;
    } catch (error) {
      console.log('Error loading role table', error);
      return null
    }

  };

  const loadRoleTable = async (schemaName, tableName) => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getRoleTable/${schemaName}`);
      setRoleData(response.data);
      const storedRole = localStorage.getItem('role');

      const filtered_role_id = response.data.filter((item) => item.Rolecode === storedRole);

      const role_id = filtered_role_id[0].id;

      const crud_permissions = await loadPermissionTable(schemaName, role_id);

      const filterCrud = crud_permissions.filter((item) => item.table === tableName)

      setTableCrud(filterCrud);

      handleButtonPermissions(filterCrud);

    } catch (error) {
      console.log('Error loading role table', error);
    }
  };

  const handleButtonPermissions = (crudData) => {
    debugger;
    if (crudData.length === 0) {
      setShowAddbutton(false);
    } else {
      const create = crudData[0].create;
      const read = crudData[0].read;
      const update = crudData[0].update;
      const delete_ = crudData[0].delete;

      if (create === 0) {
        setShowAddbutton(false);
      } else {
        setShowAddbutton(true);
      }
    }





  };

  const handleCustomAction = () => {
    setRetrievedEditData([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
  };

  const handleRetrivedRowData = (data, isEdit) => {
    console.log('Retrieved row data in parent component:', isEdit);
    console.log('retrieved data', data);
    setRetrievedEditData(data);
    setIsEdit(isEdit);
    if (!isEdit) {
      setOpen(false);
    } else if (isEdit) {
      setOpen(true);
    }
  };


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} >
        <Grid item xs={6} style={{ float: 'left' }}>
          <Typography variant='h5'>
            {selectedTable.replace(/_/g, ' ').replace(/\b\w/g, firstLetter => firstLetter.toUpperCase())}
          </Typography>

        </Grid>
        <Grid item xs={6} style={{ float: 'right' }}>
          <Box >
            {showAddbutton && (
              <Button
                size='large'
                variant='contained'
                onClick={() => handleCustomAction()}
              >
                Add
              </Button>
            )}

          </Box>
        </Grid>

      </Grid>

      <Grid item xs={12}>
        <Card>
          <Table selectedTable={selectedTable} selectedSchema={selectedSchema} onRetrivedRowData={handleRetrivedRowData} tableCrud={tableCrud} isEdit={IsEdit} />
        </Card>
      </Grid>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {selectedTable.replace('_', ' ').replace(/\b\w/g, firstLetter => firstLetter.toUpperCase())}
            </Typography>
            <FormLayoutsBasic FormFields={fields} selectedTable={selectedTable} selectedSchema={selectedSchema} editData={retrievedEditData} isEdit={IsEdit} />
          </Box>
        </Fade>
      </Modal>
    </Grid>
  )
}

export default MUITable
