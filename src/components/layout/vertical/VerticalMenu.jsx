'use client'

// Next Imports
import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import axios from 'axios';

import { v4 as uuidv4 } from 'uuid';

import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'
// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'


const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }) => {

  const [storedRole, setStoredRole] = useState(null);

  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()
  const { isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()
  const [tablesType, setTablesType] = useState([]);
  const [NewTables, setNewTables] = useState([]);
  const [executebleFields, setExecutablefields] = useState([]);
  const [ExternalLinks, setExternalLinks] = useState([]);
  const [otherTables, setOtherTables] = useState([]);
  const [configTables, setConfigTables] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState('');


  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale, id } = params
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const init = async (schemaName, roleName) => {
    try {
      const tables = await loadTables(schemaName);
      const executables = await loadStoredProcedure(schemaName);
      const externalLinks = await loadExternalLinks(schemaName);
      //const others = await loadOthers(schemaName);
      const config = await loadConfigurations(schemaName);
      const getRoleId = await loadRoleTable(schemaName, roleName);
      const getPermissions = await loadPermissionTables(schemaName, getRoleId.id);
      console.log('permissions', getPermissions);
      const viewTable = await loadViewResTables();
      const menus = [...tables, ...executables, ...externalLinks];
      console.log('menus', menus);
      const activeViewTables = viewTable.filter((table) => table.is_active === '1');
      const onlyActiveTables = activeViewTables.map((table) => ({
        Tables: table.tables
      }));
      console.log('onlyActiveTables', tables);
      const filterAddedTables = menus.filter(item => {
        return onlyActiveTables.some(table => {
          // Check if item.Tables is an object with a menu property
          if (typeof item.Tables === 'object' && item.Tables.menu) {
            return table.Tables === item.Tables.menu;
          } else {
            return table.Tables === item.Tables;
          }
        });
      });
      console.log('filterAddedTables', filterAddedTables);
      const newFilteredAddedTables = menus.filter(table => {
        return getPermissions.some(item => {
          if (typeof table.Tables === 'object' && table.Tables.menu) {
            return item.table === table.Tables.menu && item.read === 1;
          } else {
            return item.table === table.Tables && item.read === 1;
          }
        });
      });
      console.log('newFilteredAddedTables', newFilteredAddedTables);
      if (roleName === 'SA') {
        const OnlyTables = menus.filter((table) => table.type === 'T');
        console.log('only tables', OnlyTables);
        const OnlyExecutables = menus.filter((table) => table.type === 'E');
        const OnlyExtlinks = menus.filter((table) => table.type === 'EL');
        const transformedData = OnlyTables.map((item) => {
          // Generate a random unique value
          const uniqueValue = uuidv4();
          // Set the unique value in localStorage for each item
          localStorage.setItem(uniqueValue, item.Tables);
          return {
            title: item.TableComment === "" ? item.Tables : item.TableComment,
            path: `/pages/table?id=` + item.Tables,
            link: uniqueValue // Use the unique value as the link
          };
        });
        setTablesType(transformedData)
        const transformedExecuteData = OnlyExecutables.map((item) => {
          // Generate a random unique value
          const uniqueValue = uuidv4();
          // Set the unique value in localStorage for each item
          localStorage.setItem(uniqueValue, item.Tables);
          return {
            title: item.Tables,
            path: `/pages/executable?id=` + item.Tables,
            link: uniqueValue // Use the unique value as the link
          };
        });
        setExecutablefields(transformedExecuteData);
        const transformedExternalLinks = OnlyExtlinks.map((item) => {
          // Generate a random unique value
          const uniqueValue = uuidv4();
          // Set the unique value in localStorage for each item
          localStorage.setItem(uniqueValue, item.Tables.link);
          return {
            title: item.Tables.menu,
            path: `/pages/external-links?id=` + uniqueValue,
            link: uniqueValue // Use the unique value as the link
          };
        });
        setExternalLinks(transformedExternalLinks)
        console.log('only ext links', OnlyExtlinks);
      } else if (roleName === 'AD') {
        const OnlyTables = filterAddedTables.filter((table) => table.type === 'T');
        const OnlyExecutables = filterAddedTables.filter((table) => table.type === 'E');
        const OnlyExtlinks = filterAddedTables.filter((table) => table.type === 'EL');
        const transformedData = OnlyTables.map((item) => {
          // Generate a random unique value
          const uniqueValue = uuidv4();
          // Set the unique value in localStorage for each item
          localStorage.setItem(uniqueValue, item.Tables);
          return {
            title: item.TableComment === "" ? item.Tables : item.TableComment,
            path: `/pages/table?id=` + item.Tables,
            link: uniqueValue // Use the unique value as the link
          };
        });
        setTablesType(transformedData)
        const transformedExecuteData = OnlyExecutables.map((item) => {
          // Generate a random unique value
          const uniqueValue = uuidv4();
          // Set the unique value in localStorage for each item
          localStorage.setItem(uniqueValue, item.Tables);
          return {
            title: item.Tables,
            path: `/pages/executable?id=` + item.Tables,
            link: uniqueValue // Use the unique value as the link
          };
        });
        setExecutablefields(transformedExecuteData);
        const transformedExternalLinks = OnlyExtlinks.map((item) => {
          // Generate a random unique value
          const uniqueValue = uuidv4();
          // Set the unique value in localStorage for each item
          localStorage.setItem(uniqueValue, item.Tables.link);
          return {
            title: item.Tables.menu,
            path: `/pages/external-links?id=` + uniqueValue,
            link: uniqueValue // Use the unique value as the link
          };
        });
        setExternalLinks(transformedExternalLinks)
      } else {
        const OnlyTables = newFilteredAddedTables.filter((table) => table.type === 'T');
        const OnlyExecutables = newFilteredAddedTables.filter((table) => table.type === 'E');
        const OnlyExtlinks = newFilteredAddedTables.filter((table) => table.type === 'EL');
        const transformedData = OnlyTables.map((item) => {
          // Generate a random unique value
          const uniqueValue = uuidv4();
          // Set the unique value in localStorage for each item
          localStorage.setItem(uniqueValue, item.Tables);
          return {
            title: item.TableComment === "" ? item.Tables : item.TableComment,
            path: `/pages/table?id=` + item.Tables,
            link: uniqueValue // Use the unique value as the link
          };
        });
        setTablesType(transformedData);
        const transformedExecuteData = OnlyExecutables.map((item) => {
          // Generate a random unique value
          const uniqueValue = uuidv4();
          // Set the unique value in localStorage for each item
          localStorage.setItem(uniqueValue, item.Tables);
          return {
            title: item.Tables,
            path: `/pages/executable?id=` + item.Tables,
            link: uniqueValue // Use the unique value as the link
          };
        });
        setExecutablefields(transformedExecuteData);
        const transformedExtLinks = OnlyExtlinks.map((item) => {
          // Generate a random unique value
          const uniqueValue = uuidv4();
          // Set the unique value in localStorage for each item
          localStorage.setItem(uniqueValue, item.Tables.link);
          return {
            title: item.Tables.menu,
            path: `/pages/external-links?id=` + uniqueValue,
            link: uniqueValue // Use the unique value as the link
          };
        });
        setExternalLinks(transformedExtLinks)
        //console.log('transformed ext links', transformedExtLinks);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  const loadViewResTables = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getViewRestrictions`);


      return response.data;
    } catch (error) {
      console.log('error');
    }
  }

  const loadPermissionTables = async (schemaName, roleId) => {
    debugger;

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getPermissionTable/${schemaName}/${roleId}`);


      return response.data;
    } catch (error) {
      console.log('error');
    }

  }

  const loadTables = async (schemaName) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getTables/${schemaName}`);
      const tablesArray = response.data;

      console.log('tables array', tablesArray);

      const tables = tablesArray.map((item) => ({
        TableComment: item.TABLE_COMMENT,
        Tables: item.Tables,
        haveId: item.haveId,
        type: 'T'
      }));

      console.log('Tables', tables);

      const transformedData = tables.map((item) => {

        // Generate a random unique value
        const uniqueValue = uuidv4();


        // Set the unique value in localStorage for each item
        localStorage.setItem(uniqueValue, item.Tables);

        return {
          title: item.Tables,
          path: `/pages/table?id=` + item.Tables,
          link: uniqueValue // Use the unique value as the link
        };
      });

      // setTablesType(transformedData);
      // transformData(newTables);
      //return transformedData;
      setNewTables(transformedData);

      return tables
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const loadRoleTable = async (schemaName, roleCode) => {
    debugger;

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getRoles/${schemaName}/${roleCode}`);
      const roleId = response.data;


      return roleId[0]
    } catch (error) {
      console.log('error');
    }
  }

  const loadStoredProcedure = async (schemaName) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getExecutableTables/${schemaName}`);
      const tablesArray = response.data;

      console.log('ExecuteblesRes', tablesArray);

      const executebles = tablesArray.map((item) => ({
        Tables: item.name,
        haveId: 1,
        type: 'E'
      }));

      console.log('Executebles', executebles);

      return executebles
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const loadExternalLinks = async (schemaName) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getExternalLinks/${schemaName}`);
      const tablesArray = response.data;

      const externalLinks = tablesArray.map((item) => ({
        Tables: item,
        haveId: 1,
        type: 'EL'
      }));

      const externalLinksFilter = tablesArray.map((item) => ({
        Tables: item.menu,
        haveId: 1,
        type: 'EL'
      }));

      console.log('external links', response.data);

      //setExternalLinks(transformedData);
      return externalLinks
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  /* const loadOthers = async (schemaName) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getTableOthers/${schemaName}`);
      const tablesArray = response.data;

      console.log('OthersRes', tablesArray);

      const transformedData = tablesArray.map((item) => {

        return {
          title: item.name,
          path: `/pages/others?form=${item.name}&req_new_tab=${item.req_new_tab}`,

        };
      });


      //transformedData.unshift({ "sectionTitle": "Others" });
      console.log('Others table', transformedData);
      setOtherTables(transformedData);

      return tablesArray



    } catch (error) {
      console.error('Error loading tables:', error);
    }
  }; */


  const loadConfigurations = async (schemaName) => {
    try {
      const tablesArray = [
        {
          "id": 1,
          "name": "relation",
          "req_new_tab": 0,
          "is_active": 1
        },
        {
          "id": 2,
          "name": "restriction",
          "req_new_tab": 1,
          "is_active": 1
        }
      ];

      const configs = tablesArray.map((item) => ({
        Tables: item.name,
        haveId: 1,
        type: 'O'
      }));

      console.log('configs', configs);
      setConfigTables(configs);

      const transformedData = configs.map((item) => {
        const uniqueValue = uuidv4();

        localStorage.setItem(uniqueValue, item.Tables);

        return {
          title: item.Tables,
          path: `/config?id=` + uniqueValue,

          link: uniqueValue
        };
      });

      transformedData.unshift({ "sectionTitle": "Configs" });

      return transformedData;
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const getTableComment = async (tableName) => {

    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getTableComments/${selectedSchema}/${tableName}`);


      //setTableComment(response.data[0].table_comment);
      console.log("table comment", response.data[0].table_comment);

    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  useEffect(() => {
    const storedSchema = localStorage.getItem("company");

    setSelectedSchema(storedSchema);
    const role = localStorage.getItem('role');

    if (role) {
      setStoredRole(role);
    }
    init(storedSchema, role);
    loadViewResTables();

    //getTableComment();
  }, []);

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <SubMenu
          label="Tables"
          icon={<i className='ri-table-alt-line' />}
          suffix={<Chip label={tablesType.length} size='small' color='error' />}
        >
          {tablesType.map((item) => (
            <MenuItem href={`/${locale}/${item.path}`}>{item.title.replace(/_/g, ' ').replace(/\b\w/g, firstLetter => firstLetter.toUpperCase())}</MenuItem>
          ))}
        </SubMenu>

        {executebleFields.length > 0 ? (
          <SubMenu label="Executables" icon={<i className='ri-bill-line' />} suffix={<Chip label={executebleFields.length} size='small' color='error' />}>
            {executebleFields.map((item) => (
              <MenuItem href={`/${locale}/${item.path}`}>{item.title.replace(/_/g, ' ').replace(/\b\w/g, firstLetter => firstLetter.toUpperCase())}</MenuItem>
            ))}
          </SubMenu>
        ) : null}


        {storedRole === 'SA' || storedRole === 'AD' ? (
          <SubMenu label="User" icon={<i className='ri-user-line' />} suffix={<Chip label='2' size='small' color='error' />}>
            <MenuItem href={`/${locale}/${'apps/user/list'}`} icon={<i className='ri-user-settings-line' />}>Users</MenuItem>
            <MenuItem href={`/${locale}/${'apps/roles'}`} icon={<i className='ri-lock-line' />}>Permissions</MenuItem>
          </SubMenu>
        ) : null}

        {ExternalLinks.length > 0 ? (
          <SubMenu label="Links" icon={<i className='ri-link' />} suffix={<Chip label={ExternalLinks.length} size='small' color='error' />}>
            {ExternalLinks.map((item) => (
              <MenuItem href={`/${locale}/${item.path}`}>{item.title}</MenuItem>
            ))}
          </SubMenu>
        ) : null}


        {/* <SubMenu label="Others" icon={<i className='ri-more-line' />} suffix={<Chip label={otherTables.length} size='small' color='error' />}>
          {otherTables.map((item) => (
            <MenuItem href={`/${locale}/${item.path}`} key={item.title}>{item.title}</MenuItem>
          ))}


        </SubMenu> */}

        {storedRole === 'SA' ? (
          <SubMenu label="Configurations" icon={<i class="ri-settings-5-fill"></i>} suffix={<Chip label={configTables.length} size='small' color='error' />}>

            <MenuItem href={`/${locale}/${'pages/RelationPage'}`} >relation</MenuItem>

          </SubMenu>
        ) : null}


      </Menu>

    </ScrollWrapper>
  )
}

export default VerticalMenu
