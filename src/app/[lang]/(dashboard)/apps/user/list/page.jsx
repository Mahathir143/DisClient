// Component Imports
import axios from 'axios'; // Import axios for making HTTP requests

import UserList from '@views/apps/user/list'

const getData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/user-list`)

  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
}

const UserListApp = async () => {
  // Vars
  const data = await getData()

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getUserTable/${'easy_outdesk'}`);

    
return <UserList userData={response.data} />

  } catch (error) {
    console.log('Error loading role table', error);
  }



}

export default UserListApp
