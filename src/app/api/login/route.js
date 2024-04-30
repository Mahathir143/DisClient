// Next Imports
import { NextResponse } from 'next/server'

import axios from 'axios'; // Import axios for making HTTP requests

export async function POST(req) {
  // Extract email and password from the request body
  const { email, password } = await req.json()

  // Function to check login validity against the database
  const checkLogin = async (email, password) => {
    try {
      // Make a GET request to the backend API to check login validity
      const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/checkLogin/${email}/${password}`);

      // Return the data received from the backend
      return response.data;
    } catch (error) {
      // Handle errors if any occur during the request
      console.error('Error during login:', error);
      throw error; // Throw the error to handle it outside this function if needed
    }
  }

  try {
    // Check login validity against the database
    const loginResponse = await checkLogin(email, password);

    if (loginResponse.isPassValid) {
      // If the password is valid, return the user's data as a response
      const { password: _, ...filteredUserData } = loginResponse.result[0];

      console.log('details', filteredUserData);
      
return NextResponse.json(filteredUserData);
    } else {
      // If the password is not valid, return an error response
      return NextResponse.json(
        {
          message: ['Email or Password is invalid']
        },
        {
          status: 401,
          statusText: 'Unauthorized Access'
        }
      );
    }
  } catch (error) {
    // If an error occurs during the login check, return an error response
    console.error('Error during login check:', error);
    
return NextResponse.error();
  }
}
