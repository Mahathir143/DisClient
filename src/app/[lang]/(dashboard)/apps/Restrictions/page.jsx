// Component Imports
import axios from 'axios';

import ViewRestriction from '@views/apps/ViewRestriction'

const getData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/user-list`)

  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
}

const RestrictionApp = async () => {
  // Vars
  const data = await getData()

  try {
    
    const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getRestrictionTable`);

    
return <ViewRestriction userData={response.data} />
  } catch (error) {
    console.log('Error loading role table', error);
  }


}

export default RestrictionApp
