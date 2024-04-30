'use client'
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation'; // Import hooks from next/navigation
import Grid from '@mui/material/Grid'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
    ;
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'

import axios from 'axios';
import TextField from '@mui/material/TextField';
import MaterialTable from 'material-table';


const MUITable = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [selectedSchema, setSelectedSchema] = useState('easy_outdesk');
    const [procedureParameters, setProcedureParameters] = useState([]);
    const [executeInputValues, setExecuteInputValues] = useState([]);
    const [storedProcedureData, setStoredProcedureData] = useState([]);
    const [procedureName, setProcedureName] = useState('');
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);

    const handleExecuteInputChange = (e, index, data_type) => {
        const { value } = e.target;
        const updatedValues = [...executeInputValues];
        updatedValues[index] = { value, data_type };
        setExecuteInputValues(updatedValues);
    };

    const checkSPparameters = async (tableName) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/CheckProcedureParameter/${tableName}`);
            setProcedureParameters(response.data);
        } catch (error) {
            console.error("Error fetching stored procedure parameters:", error);
        }
    };

    const executeStoredProcedure = async () => {
        debugger;
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/CallStoreProcedure`, {
                params: {
                    procedureName: procedureName,
                    database: selectedSchema,
                    parameters: executeInputValues
                },
            });

            setStoredProcedureData(response.data[0]);
            const storeProcedurereturn = response.data[0];
            const newColumns = Object.keys(storeProcedurereturn[0]);
            const columnsData = newColumns.map(key => ({
                title: key.replace('_', ' ').replace(/\b\w/g, firstLetter => firstLetter.toUpperCase()),
                field: key,
                align: key.toLowerCase() === 'id' ? 'left' : 'center'
            }));

            setColumns(columnsData);
            setData(storeProcedurereturn);
            setExecuteInputValues([]);

        } catch (error) {
            console.error("Error calling stored procedure:", error);
        }
    };

    useEffect(() => {
        const id = searchParams.get('id');
        console.log('selected table',id);
        //const storedLink = localStorage.getItem(id);
        if (id !== selectedTable) {
            setSelectedTable(id);
            setProcedureName(id);
        }
    }, [searchParams.get('id')]);

    useEffect(() => {
        if (selectedTable) {
            setData([]);
            setColumns([]);
            checkSPparameters(selectedTable);
        }
    }, [selectedTable, selectedSchema]);


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

    const mysqlToHtmlInputType = {
        INT: 'number',
        TINYINT: 'checkbox',
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

    return (
        <Grid container spacing={6}>
            <Grid item xs={12} >
                <Grid item xs={6} style={{ float: 'left' }}>
                    <Typography variant='h5'>
                        {selectedTable ?
                            selectedTable.replace('_', ' ').replace(/\b\w/g, firstLetter => firstLetter.toUpperCase()) :
                            "Loading..." // or any other default text while loading
                        }
                    </Typography>


                </Grid>
                <Grid item xs={6} style={{ float: 'right' }}>
                    <Box >
                        <Button
                            size='large'
                            variant='contained'
                            onClick={executeStoredProcedure}
                        >
                            EXECUTE
                        </Button>
                    </Box>
                </Grid>

            </Grid>

            <Grid item xs={12}>
                <Box>
                    {procedureParameters.length > 0 && procedureParameters.map((item, index) => (
                        <TextField
                            style={{ marginBottom: 15 }}
                            fullWidth
                            key={index}
                            id={`outlined-required-${index}`}
                            type={mysqlToHtmlInputType[item.DATA_TYPE.toUpperCase()] || 'text'}
                            label={item.PARAMETER_NAME}
                            onChange={(e) => handleExecuteInputChange(e, index, item.DATA_TYPE)}
                        />
                    ))}
                    {procedureParameters.length === 0 && <Typography>No parameters found</Typography>}
                </Box>

            </Grid>

            <Grid item xs={12}>
                <Card>
                    <MaterialTable

                        data={data}
                        columns={columns}
                        options={{
                            search: true,
                            searchFieldAlignment: 'right', // Ensure this is set to 'right'
                            searchAutoFocus: true,
                            pageSizeOptions: [2, 5, 10, 25, 50, 100],
                            pageSize: 5,
                            paginationType: 'stepped',
                            exportButton: true,
                            exportAllData: true,
                            exportFileName: { selectedTable },
                            addRowPosition: 'first',
                            actionsColumnIndex: -1
                        }}
                        title={null}
                    />
                </Card>
            </Grid>

        </Grid>
    )
}

export default MUITable
