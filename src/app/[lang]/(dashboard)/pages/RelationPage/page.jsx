'use client'

import React, { useState, useEffect } from 'react';

import axios from 'axios';
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const RelationData = () => {

    const mysqlToHtmlInputType = {
        INT: 'number',
        TINYINT: 'number',
        SMALLINT: 'number',
        MEDIUMINT: 'number',
        BIGINT: 'number',
        DECIMAL: 'number',
        FLOAT: 'number',
        DOUBLE: 'number',
        DATE: 'date',
        TIME: 'time',
        DATETIME: 'datetime-local',
        TIMESTAMP: 'datetime-local',
        YEAR: 'number',
        CHAR: 'text',
        VARCHAR: 'text',
        TINYTEXT: 'text',
        TEXT: 'text',
        MEDIUMTEXT: 'text',
        LONGTEXT: 'text',
        ENUM: 'select',
        SET: 'select',
        TINYBLOB: 'file',
        BLOB: 'file',
        MEDIUMBLOB: 'file',
        LONGBLOB: 'file',
        BOOLEAN: 'checkbox',
    };

    const [fieldss, setFieldss] = useState([]);
    const [tableFields, setTableFields] = useState([]);
    const [schema, setSchema] = useState([]);
    const [selectedSchema, setSelectedSchema] = useState('');
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [selectedPrimaryvalue, setSelectedPrimaryvalue] = useState('');
    const [fields, setFields] = useState([]);
    const [foreignKeyTable, setForeignKeyTable] = useState([]);
    const [relationShipTable, setRelationShipTable] = useState([]);
    const [open, setOpen] = useState(false);
    const [relationEditData, setRelationEditData] = useState([]);
    const [isDataAlreadyThere, setIsDataAlreadyThere] = useState();
    const [fetchOpen, setFetchOpen] = useState(false);



    const [relationfields, setRelatinFields] = useState([]);
    const [columns, setColumns] = useState([]);
    const [values, setValues] = useState([]);

    const [selectedPrimarytext, setSelectedPrimarytext] = useState('');
    const [shouldShowColumn, setShouldShowCOlumn] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleClick = () => {
        setFetchOpen(true);
    };

    const handleFetchClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setFetchOpen(false);
    };
    

    const action = (
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleFetchClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
    );

    const actionSubmit = (
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
    );
    


    const getRelationshipDetails = async (schemaName) => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getRelationshipDetailsTable/${schemaName}`);

            setRelationShipTable(response.data);
            console.log("relationShipDetails", response.data);
        } catch (error) {
            console.error('Error loading tables:', error);
        }
    }

    const getForeignKeyDetails = async (schemaName) => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getForeignKeyDetails/${schemaName}`);

            setForeignKeyTable(response.data);
            console.log('foreign key tables', response.data);
        } catch (error) {
            console.error('Error loading schema:', error);
        }
    };

    const loadData = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/getDatabases');

            setSchema(response.data);
        } catch (error) {
            console.error('Error loading schema:', error);
        }
    };

    const loadTables = async (schemaName) => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getTables/${schemaName}`);

            setTables(response.data);
        } catch (error) {
            console.error('Error loading tables:', error);
        }
    };

    const handleSchemaChange = (schemaName) => {
        setSelectedSchema(schemaName);
        getForeignKeyDetails(schemaName);
        getRelationshipDetails(schemaName);
        loadTables(schemaName);
        setSelectedTable(''); // Clear the selected table when changing the schema
        const newFields = [...fieldss];

        newFields['schema_name'] = schemaName;

        //setFieldss([{ schema_name: '', primary_table: '', primary_table_value: '', primary_table_text: '', relation_table: '', Relation_Table_value: '', relation_dependency_value: '', primary_dependency_value: '' }]);
    };

    const loadFields = async (tableName) => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getTableFields/${selectedSchema}/${tableName}`
            );

            setFields(response.data);
            console.log('fields data', response.data);
        } catch (error) {
            console.error('Error loading fields:', error);
        }
    };

    const handleRefresh = async () => {
        

        const notEqualItemsInsert = foreignKeyTable.filter((forItem) => {
            // Check if there is no matching relation in relationShipTable
            const hasMatchingRelation = relationShipTable.some((item) => forItem.TABLE_NAME === item.Relation_Table);

            // Return true for items without a match, false for items with a match
            return !hasMatchingRelation;
        });

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/insertExtraRelationdata`, {
                SelectedSchema: selectedSchema,

            });
            setFetchOpen(true);

        } catch (error) {
            console.error(error);

        }


    }

    const handleTableChange = (tableName) => {
        setSelectedTable(tableName);
        setSelectedPrimaryvalue(''); // Clear the selected value when changing the table
        loadFields(tableName);
        const newFields = [...fieldss];

        newFields['primary_table'] = tableName;
        setFieldss(newFields);
    };

    const handleFieldChangeValue = async (field) => {
        setSelectedPrimaryvalue(field);
        const newFields = [...fieldss];

        newFields['primary_table_value'] = field;
        setFieldss(newFields);

        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getRelationEditData/${selectedSchema}/${selectedTable}/${field}`);
            const relationData = response.data;

            setRelationEditData(relationData);
            console.log("relationEditData", relationData);

            if (relationData.length > 0) {
                setIsDataAlreadyThere(true);
            } else {
                setIsDataAlreadyThere(false);
            }

            const newFieldsToAdd = relationData.map(item => {
                handleAddEditFields(item); // Invoke handleAddEditFields function here

                return {
                    schema_name: '',
                    primary_table: '',
                    primary_table_value: '',
                    primary_table_text: item.Primary_Table_Text,
                    Relation_Table: item.Relation_Table,
                    Relation_Table_value: item.Relation_Table_value,
                    relation_dependency_value: item.relation_dependency_value,
                    primary_dependency_value: item.primary_dependency_value,
                    is_active: '1'
                };
            });

            setFieldss([...fieldss, ...newFieldsToAdd]);

            const fieldRequests = relationData.map(async (item) => {
                try {
                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getFields/${selectedSchema}/${item.Relation_Table}`
                    );


                    return response.data;
                } catch (error) {
                    console.error('Error loading fields:', error);

                    return null;
                }
            });

            const updatedTableFields = await Promise.all(fieldRequests);

            setTableFields(updatedTableFields);
            console.log('table fields', updatedTableFields);
        } catch (error) {
            console.error('Error loading tables:', error);
        }
    };





    const handleFieldChangeText = (field) => {
        setSelectedPrimarytext(field);
        const newFields = [...fieldss];

        newFields['primary_table_text'] = field;
        setFieldss(newFields);

    };


    const handleChangeInput = async (index, event) => {
        debugger;
        const table_name = event.target.value;

        console.log("number of fieldss:", fieldss);
        const newFields = [...fieldss];

        newFields[index]['Relation_Table'] = table_name;
        newFields[index]['Relation_Table_value'] = '';
        newFields[index]['relation_dependency_value'] = '';
        newFields[index]['primary_dependency_value'] = '';
        setFieldss(newFields);


        // Fetch table fields dynamically based on the selected table
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getFields/${selectedSchema}/${table_name}`
            );

            const updatedTableFields = [...tableFields];

            updatedTableFields[index] = response.data;
            setTableFields(updatedTableFields);
            console.log('table fields', updatedTableFields);
        } catch (error) {
            console.error('Error loading fields:', error);
        }
    };

    const handleField1Change = (index, event) => {
        const { value } = event.target;
        const newFields = [...fieldss];

        newFields[index]['Relation_Table_value'] = value;
        setFieldss(newFields);
    };

    const handleField2Change = (index, event) => {
        const { value } = event.target;
        const newFields = [...fieldss];

        newFields[index]['relation_dependency_value'] = value;
        setFieldss(newFields);
    };

    const handleField3Change = (index, event) => {
        const { value } = event.target;
        const newFields = [...fieldss];

        newFields[index]['primary_dependency_value'] = value;
        setFieldss(newFields);
    }

    const handleAddFields = () => {
        setFieldss([...fieldss, { schema_name: '', primary_table: '', primary_table_value: '', primary_table_text: '', Relation_Table: '', Relation_Table_value: '', relation_dependency_value: '', primary_dependency_value: '', is_active: '' }]);
    };

    const handleAddEditFields = (editRelationData) => {
        debugger;
        setFieldss([...fieldss, { schema_name: '', primary_table: '', primary_table_value: '', primary_table_text: '', Relation_Table: '', Relation_Table_value: '', relation_dependency_value: '', primary_dependency_value: '', is_active: '' }]);

    };

    const handleRemoveFields = (index) => {
        const newFields = [...fieldss];

        newFields[index].is_active = '0'; // Update the is_active property of the corresponding item
        newFields.splice(index, 1);
        setFieldss(newFields);
    };


    const handleSubmits = async (event) => {
        event.preventDefault();

        const updatedFieldss = fieldss.map(field => ({
            ...field,
            primary_table: selectedTable,
            primary_table_value: selectedPrimaryvalue,
            primary_table_text: selectedPrimarytext,
            schema_name: selectedSchema
        }));

        console.log(updatedFieldss); // You can perform further actions here, like sending data to an API

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/insertAndUpdateRelationdata`, {
                SelectedSchema: selectedSchema,
                relationship_table_data: updatedFieldss,
                isDatathere: isDataAlreadyThere,
                EditData: relationEditData

            });

            setOpen(true);

        } catch (error) {
            console.error(error);
            setOpen(false);
        }

    };

    const commonStyles = {
        bgcolor: 'background.paper',
        m: 1,
        border: 1,
        width: '100%',
        padding: '20px'

    };

    useEffect(() => {
        loadData();
    }, []);



    return (
        <Grid container spacing={6}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} action={actionSubmit}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Relation Successfully Added
                </Alert>
            </Snackbar>

            <Snackbar
                open={fetchOpen}
                autoHideDuration={6000}
                onClose={handleFetchClose}
                message="Auto fetch successfull"
                action={action}
            />
            <Box sx={{ ...commonStyles, justifyContent: 'center', borderColor: 'primary.main' }}>
                <Grid container spacing={2} >
                    <Grid item xs={12}>
                        <h2>Relationship Management</h2>
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ paddingBottom: '20px' }} >
                    <Grid item xs={6}>
                        <Typography variant="h5" style={{ textAlign: 'left' }}>Schemas</Typography>
                        <FormControl style={{ width: '100%', marginTop: '15px', marginBottom: 15 }}>
                            <Select
                                value={selectedSchema}
                                onChange={(e) => handleSchemaChange(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Select Schema</em>
                                </MenuItem>
                                {schema.map((item, index) => (
                                    <MenuItem key={index} value={item.Database}>
                                        {item.Database}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {shouldShowColumn && (
                        <Grid item xs={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button variant='contained' onClick={handleRefresh}>Auto Fetch</Button>
                        </Grid>
                    )}
                </Grid>
                <Divider />
                {/* -----------------------primary table----------------------------------- */}
                {selectedSchema ? (
                    <Grid container spacing={6} style={{ paddingTop: '20px' }}>
                        <Grid item xs={6} md={6}>
                            <Typography variant="h5" style={{ textAlign: 'left' }}>Primary Table Details</Typography>

                            <FormControl style={{ width: '100%', marginTop: '15px', marginBottom: 15 }}>
                                <InputLabel id='select-primary'>Primary Table</InputLabel>
                                <Select
                                    fullWidth
                                    id='select-primary'
                                    value={selectedTable} // Set the value to formData.role (assuming role field exists in formData)
                                    onChange={(e) => handleTableChange(e.target.value)}
                                    label='Select Primary table'

                                    inputProps={{ placeholder: 'Select Primary table' }}
                                >
                                    {tables.map((item, index) => (
                                        <MenuItem key={index} value={item.Tables}>{item.Tables}</MenuItem>
                                    ))}
                                </Select>



                            </FormControl>

                            {selectedTable ? (
                                <FormControl style={{ width: '100%', marginTop: '15px', marginBottom: 15 }}>
                                    <InputLabel id='select-primary_value'>Primary Table Value</InputLabel>
                                    <Select
                                        fullWidth
                                        id='select-primary_value'

                                        // value={selectedTable} // Set the value to formData.role (assuming role field exists in formData)
                                        onChange={(e) => handleFieldChangeValue(e.target.value)}
                                        label='Select Primary table value'

                                        inputProps={{ placeholder: 'Select Primary value' }}
                                    >
                                        {fields.map((item, index) => (
                                            <MenuItem key={index} value={item.column_name}>{item.column_name}</MenuItem>
                                        ))}
                                    </Select>



                                </FormControl>
                            ) : null}

                            {selectedTable ? (
                                <FormControl style={{ width: '100%', marginTop: '15px', marginBottom: 15 }}>
                                    <InputLabel id='select-primary_text'>Primary Table Text</InputLabel>
                                    <Select
                                        fullWidth
                                        id='select-primary_text'
                                        value={fieldss.primary_table_text} // Set the value to formData.role (assuming role field exists in formData)
                                        onChange={(e) => handleFieldChangeText(e.target.value)}
                                        label='Select Primary text'

                                        inputProps={{ placeholder: 'Select Primary text' }}
                                    >
                                        {fields.map((item, index) => (
                                            <MenuItem key={index} value={item.column_name}>{item.column_name}</MenuItem>
                                        ))}
                                    </Select>



                                </FormControl>
                            ) : null}
                        </Grid>

                        {/*--------------------------------------- Relation table -------------------------*/}

                        {selectedTable ? (
                            <Grid item xs={6} md={6}>
                                <Typography variant="h5" style={{ textAlign: 'left' }}>Relation Table Details</Typography>
                                <form onSubmit={handleSubmits} className='flex flex-col gap-5'>
                                    {fieldss.map((field, index) => (
                                        <div key={index}>

                                            <FormControl style={{ width: '100%', marginTop: '15px', marginBottom: 15 }}>
                                                <InputLabel id='relation_table'>Relation Table</InputLabel>
                                                <Select
                                                    fullWidth
                                                    id='relation_table'
                                                    value={fieldss[index].Relation_Table} // Set the value to formData.role (assuming role field exists in formData)
                                                    onChange={(event) => handleChangeInput(index, event)}
                                                    label='Select Relation Table'

                                                    inputProps={{ placeholder: 'Select Relation table' }}
                                                >
                                                    {tables.map((item, index) => (
                                                        <MenuItem key={index} value={item.Tables}>{item.Tables}</MenuItem>
                                                    ))}
                                                </Select>



                                            </FormControl>


                                            <FormControl style={{ width: '100%', marginTop: '15px', marginBottom: 15 }}>
                                                <InputLabel id='relation_table_value'>Relation Value</InputLabel>
                                                <Select
                                                    fullWidth
                                                    id='relation_table_value'
                                                    value={fieldss[index].Relation_Table_value} // Set the value to formData.role (assuming role field exists in formData)
                                                    onChange={(event) => handleField1Change(index, event)}
                                                    label='Select Relation Value'

                                                    inputProps={{ placeholder: 'Select Relation value' }}
                                                >
                                                    {tableFields[index]?.map((item, index) => (
                                                        <MenuItem key={index} value={item.column_name}>{item.column_name}</MenuItem>
                                                    ))}
                                                </Select>



                                            </FormControl>


                                            <FormControl style={{ width: '100%', marginTop: '15px', marginBottom: 15 }}>
                                                <InputLabel id='relation_dependency_value'>Relation Dependency Value</InputLabel>
                                                <Select
                                                    fullWidth
                                                    id='relation_dependency_value'
                                                    value={fieldss[index].relation_dependency_value} // Set the value to formData.role (assuming role field exists in formData)
                                                    onChange={(event) => handleField2Change(index, event)}
                                                    label='Select Relation Value'

                                                    inputProps={{ placeholder: 'Select value column' }}
                                                >
                                                    {tableFields[index]?.map((item, index) => (
                                                        <MenuItem key={index} value={item.column_name}>{item.column_name}</MenuItem>
                                                    ))}
                                                </Select>



                                            </FormControl>


                                            <FormControl style={{ width: '100%', marginTop: '15px', marginBottom: 15 }}>
                                                <InputLabel id='primary_dependency_value'>Primary Dependency Value</InputLabel>
                                                <Select
                                                    fullWidth
                                                    id='primary_dependency_value'
                                                    value={fieldss[index].primary_dependency_value}// Set the value to formData.role (assuming role field exists in formData)
                                                    onChange={(event) => handleField3Change(index, event)}
                                                    label='Select Relation Value'

                                                    inputProps={{ placeholder: 'Select value column' }}
                                                >
                                                    {fields.map((item, index) => (
                                                        <MenuItem key={index} value={item.column_name}>{item.column_name}</MenuItem>
                                                    ))}
                                                </Select>



                                            </FormControl>


                                            <Button variant="outlined" color="error" onClick={() => handleRemoveFields(index)}>
                                                Remove
                                            </Button>


                                        </div>
                                    ))}
                                    <Button variant="outlined" style={{ float: 'right' }} onClick={handleAddFields}>
                                        Add More
                                    </Button>


                                    <Button
                                        type="submit"
                                        variant="contained" color="success"
                                        style={{ width: '100%', height: '40px' }}
                                    >
                                        Submit
                                    </Button>
                                </form>
                            </Grid>
                        ) : null}


                    </Grid>

                ) : null}


            </Box>

        </Grid>

    );
};

export default RelationData;
