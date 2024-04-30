'use client';

// MUI Imports
import { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import axios from 'axios'; // Import axios for making HTTP requests

// Component Imports
import UserListTable from './UserListTable';
import UserListCards from './UserListCards';

const UserList = (userData) => {

  const [submitSuccess, setSubmitSuccess] = useState();

  //const [userData, setUserData] = useState([]); // Change state name to userData
  console.log('user data', userData);

  /* useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getUserTable/${'easy_outdesk'}`);
        setUserData(response.data);
        console.log("user:", response.data);
      } catch (error) {
        console.log('Error loading role table', error);
      }
    };

    fetchData(); // Call the function to fetch data when the component mounts
  }, []); // Empty dependency array ensures this effect runs only once after the initial render */

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListCards />
      </Grid>
      <Grid item xs={12}>
        <UserListTable tableData={userData} />
      </Grid>
    </Grid>
  );
};

export default UserList;
