'use client'

import React from 'react';
import MaterialTable from 'material-table';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from '@core/styles/table.module.css'
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import * as XLSX from 'xlsx';


const Table = ({ selectedTable, selectedSchema, onRetrivedRowData, tableCrud, isEdit: IsEdit }) => {

    console.log('selected schema:', selectedSchema);
    console.log('table crud:', tableCrud);

    const [retrivedRowData, setretrivedRowData] = useState([]);
    const [isEdit, setIsEdit] = useState(IsEdit);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [fields, setFields] = useState([]);
    const [defaultFields, setDefaultFields] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [tableLength, setTableLength] = useState();
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState();
    const [sort, setSort] = useState('');
    const [sortCol, setSortCol] = useState('');
    const [exportData, setExportData] = useState([]);
    const [showEditbutton, setShowEditbutton] = useState();
    const [showDeletebutton, setShowDeletebutton] = useState();
    const [deleteId, setDeleteId] = useState();
    const [deleteRecordvalue, setDeleteRecord] = useState();

    const [open, setOpen] = useState(false);


    const tableRef = useRef();




    console.log('totalPages', totalPages);

    const [sorting, setSorting] = useState({ column: null, order: 'asc' }); // State to track sorting
    const [sortClick, setSortClick] = useState();

    const handleSortChange = (columnName, sortOrder, columns) => {
        setSortClick(true);
        console.log(columnName);
        console.log(sortOrder);
        console.log(columns);
        const columnsArray = columns.map((item) => item.field);
        const selectedColumnName = columnsArray[columnName];
        console.log(selectedColumnName, sortOrder);
        setSorting({ column: selectedColumnName, order: sortOrder });
    };

    const handleRowDelete = (oldDataId, oldData, resolve) => {
        const requestData = { ...oldData };
        delete requestData.id;
        delete requestData.tableData; // Remove tableData property

        axios.post(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/delete_and_archive`, {
            database: 'easy_outdesk',
            table: selectedTable,
            valueId: oldDataId,
            columns: requestData, // Pass modified requestData
            values: requestData,
            isTableDependent: false,
            username: 'super admin',
        })
            .then(response => {
                if (response.status === 200) {
                    // Handle success
                    refreshTable(); // Refresh the table after successful deletion
                } else {
                    console.log('error');
                }
                resolve(); // Resolve the promise
            })
            .catch(error => {
                // Handle error
                console.error(error);
                resolve(); // Resolve the promise
            });
    }



    const refreshTable = () => {
        tableRef.current && tableRef.current.onQueryChange();
    };

    const actions = [
        showEditbutton && {
            icon: 'edit',
            tooltip: 'Edit',
            onClick: (event, rowData) => {
                debugger;
                console.log("Clicked row data:", rowData);
                const rowId = rowData.id;
                setretrivedRowData(rowData);
                //setIsEdit(true);
                onRetrivedRowData(rowData, true);
                //setIsEdit(false);
            }
        },
        /* showDeletebutton && {
            icon: 'delete',
            tooltip: 'Delete',
            onClick: (event, rowData) => {
                deleteRecord(rowData.id, rowData)
                
            }
        }, */
        {
            icon: 'refresh',
            tooltip: 'Refresh Data',
            isFreeAction: true,
            onClick: () => tableRef.current && tableRef.current.onQueryChange(),
        },
        {
            icon: 'save_alt',
            tooltip: 'export',
            isFreeAction: true,
            onClick: () => downloadExcel()
        }

    ];

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        setIsEdit(false);
    }

    const handleButtonPermissions = (crudData) => {

        if (crudData.length === 0) {
            setShowEditbutton(false);
            setShowDeletebutton(false);
        } else {
            const read = crudData[0]?.read;
            const update = crudData[0]?.update;
            const delete_ = crudData[0]?.delete;


            if (update === 0) {
                setShowEditbutton(false);
            } else {
                setShowEditbutton(true);
            }

            if (delete_ === 0) {
                setShowDeletebutton(false);
            } else {
                setShowDeletebutton(true);
            }
        }



    };

    const downloadExcel = () => {

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Convert JSON array to worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Generate a downloadable file
        XLSX.writeFile(wb, 'data.xlsx');
    };







    const loadFields = async (tableName) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getFields/${selectedSchema}/${tableName}`);
            setFields(response.data);
        } catch (error) {
            console.error('Error loading tables:', error);
        }
    };

    const formatDates = async () => {

        if (fields.length === 0) return;
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getForTables3/${'easy_outdesk'}/${selectedTable}`);
            const formatType = 'yyyy-MM-dd';
            const newArray = response.data.map(item => {
                const newItem = { ...item };
                fields.forEach(column => {
                    if (newItem.hasOwnProperty(column.column_name) && (column.data_type === 'datetime' || column.data_type === 'date')) {
                        const originalDate = new Date(newItem[column.column_name]);
                        const formattedDate = format(originalDate, formatType);
                        newItem[column.column_name] = formattedDate;
                    }
                });
                return newItem;
            });
            const keys = Object.keys(newArray[0]);
            console.log('column keys', keys);
            const columnsData = keys.map(key => {
                let columnData = {
                    title: key.replace('_', ' ').replace(/\b\w/g, firstLetter => firstLetter.toUpperCase()),
                    field: key,

                };
                const matchingField = fields.find(field => field.column_name === key);
                if (key.toLowerCase() === 'id' || (matchingField && matchingField.data_type === "mediumblob")) {
                    columnData.hidden = true;
                } else if (matchingField && matchingField.data_type === 'int') {
                    columnData.align = 'center';
                } else if (matchingField && (matchingField.data_type === 'datetime' || matchingField.data_type === 'date')) {
                    columnData.render = rowData => {
                        const originalDate = new Date(rowData[key]);
                        return !isNaN(originalDate) ? format(originalDate, formatType) : '';
                    };
                } else {
                    columnData.align = 'center';
                }
                return columnData;
            });
            setColumns(columnsData);
            console.log('remote columns', columnsData);
            setRows(newArray); // Update rows state with formatted data
        } catch (error) {
            console.error(error);
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


    useEffect(() => {
        setSortClick(false);
        refreshTable();
        const fetchData = async () => {
            await loadFields(selectedTable);
            await formatDates();
        };

        handleButtonPermissions(tableCrud);

        fetchData();


    }, [selectedTable, selectedSchema, tableCrud]); // Only update when these dependencies change

    useEffect(() => {
        formatDates();
        debugger;
        if (isEdit) {
            onRetrivedRowData(retrivedRowData, isEdit);
            setIsEdit(false);
        }
    }, [fields, retrivedRowData]); // Update formatDates when fields change


    /* useEffect(() => {
        if (sortClick && sorting.column) {
            refreshTable(); // Call refreshTable when sorting parameters change
        }
    }, [sortClick, sorting.column]); */

    return (
        <>

            <MaterialTable
                title=" "
                tableRef={tableRef}
                columns={columns}
                data={query =>
                    new Promise((resolve, reject) => {

                        let url = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getForTables2?`;
                        url += `tableName=${selectedTable}&`;
                        url += `schemaName=${selectedSchema}&`;
                        url += `per_page=${query.pageSize}&`;
                        url += `page=${query.page + 1}`;


                        // Pass search query to API
                        if (query.search) {
                            url += `&search=${query.search}&columns=${columns.map(column => column.field).join(',')}`;
                        }

                        // Pass sorting parameters to API
                        if (sortClick && sorting.column) {
                            url += `&sort=${sorting.order === 'asc' ? 'desc' : 'asc'}&sortCol=${sorting.column}`;
                        }

                        fetch(url)
                            .then(response => response.json())
                            .then(result => {
                                console.log('new remote response', result);
                                setExportData(result.allData);
                                resolve({
                                    data: result.data,
                                    page: result.page,
                                    totalCount: result.total,
                                });
                            })
                            .catch(error => reject(error));
                    })
                }
                options={{
                    search: true,

                    sorting: true,
                    exportFileName: 'table_data',
                    addRowPosition: 'first',
                    actionsColumnIndex: -1,
                    headerStyle: { textAlign: 'center' },
                    cellStyle: { textAlign: 'center' }

                }}
                actions={actions}
                editable={{
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            handleRowDelete(oldData.id, oldData, resolve)
                        }),
                }}
                onOrderChange={(orderBy, orderDirection) => handleSortChange(orderBy, orderDirection, columns)}
                components={{
                    Container: props => <div {...props} className={styles.table} style={{ textAlign: 'center' }} />
                }}





            />

        </>
    );



};
export default Table;
