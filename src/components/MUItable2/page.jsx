'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import axios from 'axios';

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import TableFilters from './TableFilters'
import AddUserDrawer from './AddUserDrawer'
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import select from '@/@core/theme/overrides/select';

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Vars
const userRoleObj = {
  admin: { icon: 'ri-vip-crown-line', color: 'error' },
  author: { icon: 'ri-computer-line', color: 'warning' },
  editor: { icon: 'ri-edit-box-line', color: 'info' },
  maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
  subscriber: { icon: 'ri-user-3-line', color: 'primary' }
}

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper()

const MUITABLE2 = ({ selectedTable, selectedSchema, onRetrivedRowData, tableCrud, isEdit: IsEdit }) => {

  console.log('selected data', selectedTable, selectedSchema);

  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})

  const [submitSuccess, setSubmitSuccess] = useState();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('')
  const [editUserdata, setUserEditData] = useState(null);
  const [isEditClick, setIsEditClick] = useState(false);


  const [retrivedRowData, setretrivedRowData] = useState([]);
  const [isEdit, setIsEdit] = useState(IsEdit);
  const [fields, setFields] = useState([]);
  const [columns1, setColumns] = useState([]);
  const [rows, setRows] = useState([]);


  const [open, setOpen] = useState(false);

  const handleEdit = (id) => {
    debugger;
    console.log(
      data
    )
    setIsEditClick(true);
    const userIdMatch = data.filter(item => item.id === id);
    setUserEditData(id.original);
    const arr = Object.values(id.original);
    console.log('selected edit data', id.original);
    setAddUserOpen(true);
  }

  // Hooks
  const { lang: locale } = useParams()

  // Function to handle the update of submitSuccess state
  const handleSubmissionSuccess = (success) => {
    setSubmitSuccess(success);
  };

  const columns = useMemo(() => {
    const columns = fields.map(column => ({
      id: column.column_name,
      header: column.COLUMN_COMMENT,
      cell: ({ row }) => (
        <Typography>{row.original[column.column_name]}</Typography>
      )
    }));

    // Add action column at the end
    columns.push({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center'>
          <IconButton onClick={() => handleEdit(row)}>
            <i className='ri-edit-box-line text-[22px] text-textSecondary' />
          </IconButton>

          <IconButton>
            <i className='ri-delete-bin-7-line text-[22px] text-textSecondary' />
          </IconButton>

          <IconButton>
            <Link href={getLocalizedUrl('apps/user/view', locale)} className='flex'>
              <i className='ri-eye-line text-[22px] text-textSecondary' />
            </Link>
          </IconButton>

          <OptionMenu
            iconClassName='text-[22px] text-textSecondary'
            options={[
              {
                text: 'Download',
                icon: 'ri-download-line text-[22px]',
                menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
              },
            ]}
          />
        </div>
      )
    });

    return columns;
  }, [fields]);



  console.log('all table datas:', data);

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,

    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const getAvatar = params => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(fullName)}
        </CustomAvatar>
      )
    }
  }

  const loadFields = async (tableName) => {
    debugger;
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getFields/${'easy_outdesk'}/${selectedTable}`);
      setFields(response.data);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const formatDates = async () => {
    debugger;
    //if (fields.length === 0) return;
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
      setData(newArray);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseSnack = (event, reason) => {
    console.log('Snackbar closed with reason:', reason);
    if (reason === 'clickaway') {
      return;
    }

    setSubmitSuccess(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadFields(selectedTable);
      await formatDates();
      const url = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getForTables2?`;
      const queryParams = new URLSearchParams({
        tableName: selectedTable,
        schemaName: selectedSchema,
        per_page: rowsPerPage,
        page: currentPage + 1 // Pages are usually 1-indexed, so we add 1 to currentPage
      });
      try {
        const response = await axios.get(`${url}${queryParams.toString()}`);
        setData(response.data.data);
        console.log('table page data', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedTable, selectedSchema, currentPage, rowsPerPage]);




  return (
    <>
      <Snackbar open={submitSuccess} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="success" variant="filled" sx={{ width: '100%' }}>
          User Added!
        </Alert>
      </Snackbar>

      <Card>
        <CardHeader title="Filters" />
        <Divider />
        <div className="flex justify-between p-5 gap-4 flex-col items-start sm:flex-row sm:items-center">
          <Button color="secondary" variant="outlined" startIcon={<i className="ri-upload-2-line text-xl" />}>
            Export
          </Button>
          <div className="flex items-center gap-x-4 is-full gap-4 flex-col sm:is-auto sm:flex-row">
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search User"
              className="is-full sm:is-auto"
            />
            <Button variant="contained" onClick={() => setAddUserOpen(!addUserOpen)} className="is-full sm:is-auto">
              Add
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.id}>{column.header}</th>
                ))}
              </tr>

            </thead>
            <tbody>
              {data?.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.id}>{column.cell({ row: { original: row } })}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          className="border-bs"
          count={data.length} // Update with the total count of rows from your backend
          rowsPerPage={rowsPerPage}
          page={currentPage}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
          }}
          onPageChange={(event, newPage) => setCurrentPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setCurrentPage(0); // Reset to the first page when rows per page changes
          }}
        />

      </Card>
      <AddUserDrawer open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        editUserdata={editUserdata}
        editClick={isEditClick}
        setIsEditClick={setIsEditClick}
        onSubmissionSuccess={handleSubmissionSuccess}
        selectedTable={selectedTable}
        selectedSchema={selectedSchema}
        FormFields={fields}
      />
    </>
  );
};

export default MUITABLE2
