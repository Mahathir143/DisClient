// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

const TableFilters = ({ setData, tableData }) => {

  console.log('filters data', tableData);
  // States
  const [role, setRole] = useState('')


  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (role && user.Rolename !== role) return false


      return true
    })

    setData(tableData)
  }, [role, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='role-select'>Select Role</InputLabel>
            <Select
              fullWidth
              id='select-role'
              value={role}
              onChange={e => setRole(e.target.value)}
              label='Select Role'
              labelId='role-select'
              inputProps={{ placeholder: 'Select Role' }}
            >
              <MenuItem value=''>Select Role</MenuItem>
              {Array.from(new Set(tableData.map(item => item.Rolename))).map(roleName => (
                <MenuItem key={roleName} value={roleName}>{roleName}</MenuItem>
              ))}
            </Select>
          </FormControl>


        </Grid>

      </Grid>
    </CardContent>
  )
}

export default TableFilters
