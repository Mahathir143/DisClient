'use client';

// React Imports
import { useEffect, useState, useMemo } from 'react';


// Next Imports
import Link from 'next/link';
import { useParams } from 'next/navigation';

import axios from 'axios';



// MUI Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';

// Third-party Imports
import classnames from 'classnames';
import { rankItem } from '@tanstack/match-sorter-utils';
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
} from '@tanstack/react-table';

import RestrictionDialog from '../../../components/dialogs/restriction-dialog';
import RestrictionDialogEdit from '../../../components/dialogs/restriction-dialog-edit';

// Component Imports

import OptionMenu from '@core/components/option-menu';
import CustomAvatar from '@core/components/mui/Avatar';

// Util Imports
import { getInitials } from '@/utils/getInitials';
import { getLocalizedUrl } from '@/utils/i18n';

// Style Imports
import tableStyles from '@core/styles/table.module.css';

// Styled Components
const Icon = styled('i')({});

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />;
};

// Vars
const userRoleObj = {
  admin: { icon: 'ri-vip-crown-line', color: 'error' },
  author: { icon: 'ri-computer-line', color: 'warning' },
  editor: { icon: 'ri-edit-box-line', color: 'info' },
  maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
  subscriber: { icon: 'ri-user-3-line', color: 'primary' }
};

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
};

// Column Definitions
const columnHelper = createColumnHelper();

const RestrictionTable = ({ tableData }) => {
  console.log('view restriction data', tableData);

  // States
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);

  const [data, setData] = useState(...[tableData]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [editUserdata, setUserEditData] = useState(null);
  const [isEditClick, setIsEditClick] = useState(false);
  const [editId, setEditId] = useState();
  const [tableType, setTableType] = useState();
  const [editTableName, setEditTablename] = useState();
  const [isActiveTable, setIsActiveTable] = useState();
  const [editPermissionData, setEditPermissionData] = useState([]);
  const [retrievedRoleData, setretrievedRoleData] = useState([]);


  // Handle onClick event
  const handleAddRestriction = e => {
    setOpenNewDialog(true);
  };


  const handleEdit = async (id, type, tables, is_active) => {
    console.log('edit data', id, type, tables, is_active);
    setOpenEditDialog(true);
    setEditId(id);
    setTableType(type);
    setEditTablename(tables);
    setIsActiveTable(is_active);

    /* setEditId(id);
    setIsEditClick(true);
    setOpenEditDialog(true);
    const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getRolePermissionData/${'easy_outdesk'}/${id}`);


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
    setretrievedRoleData(retrievedRoleData); */

  };

  // Hooks
  const { lang: locale } = useParams();

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('id', {
        header: 'S.no',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>

            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.id}
              </Typography>

            </div>
          </div>
        )
      }),

      /* columnHelper.accessor('Rolename', {
        header: 'Rolename',
        cell: ({ row }) => <Typography>{row.original.Rolename}</Typography>
      }), */
      columnHelper.accessor('Schema', {
        header: 'Schema',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>

            <Typography className='capitalize' color='text.primary'>
              {row.original.Schema}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('Type', {
        header: 'Type',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original.type}
          </Typography>
        )
      }),

      columnHelper.accessor('Tables', {
        header: 'Tables',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original.tables}
          </Typography>
        )
      }),

      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div >
            <IconButton onClick={() => handleEdit(row.original.id, row.original.type, row.original.tables, row.original.is_active)}>
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
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
  });

  const getAvatar = params => {
    const { avatar, fullName } = params;

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />;
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(fullName)}
        </CustomAvatar>
      );
    }
  };

  return (
    <>
      <Card>
        <CardHeader title='Roles and Permissions' />

        <Divider />
        <div className='flex justify-between p-5 gap-4 flex-col items-start sm:flex-row sm:items-center'>
          <Button
            color='secondary'
            variant='outlined'
            startIcon={<i className='ri-upload-2-line text-xl' />}
            className='is-full sm:is-auto'
          >
            Export
          </Button>
          <div className='flex items-center gap-x-4 is-full gap-4 flex-col sm:is-auto sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search User'
              className='is-full sm:is-auto'
            />
            <Button variant='contained' onClick={() => handleAddRestriction()} className='is-full sm:is-auto'>
              Add Restrictions
            </Button>
          </div>
        </div>
        <div >
          <RestrictionDialog open={openNewDialog} setOpen={setOpenNewDialog} />
        </div>
        <div>
          <RestrictionDialogEdit open={openEditDialog} setOpen={setOpenEditDialog} editId={editId} tableType={tableType} editTableName={editTableName} isActiveTable={isActiveTable} />
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page);
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>


    </>
  );
};

export default RestrictionTable;
