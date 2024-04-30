'use client';

// React Imports
import { useState } from 'react';

// Next Imports
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

// MUI Imports
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';


import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled, useTheme } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';



// Third-party Imports
import { signIn } from 'next-auth/react';
import { Controller, useForm, getValues } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { object, minLength, string, email } from 'valibot';

// Component Imports
import Logo from '@core/svg/Logo';
import Illustrations from '@components/Illustrations';

// Config Imports
import themeConfig from '@configs/themeConfig';

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant';

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n';

const schema = object({
  email: string([minLength(1, 'This field is required'), email('Email is invalid')]),
  password: string([
    minLength(1, 'This field is required'),
    minLength(5, 'Password must be at least 5 characters long')
  ])
});

const Login = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [company, setCompany] = useState('');
  const [username, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [schemaList, setSchemaList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginDetailsData, setLoginDetailsData] = useState([]);
  const [permissionTableNames, setPermissionTableNames] = useState([]);
  const [crudPermission, setcrudPermission] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [ispassValid, setIsPassvalid] = useState(true);
  const [isCompanyselected, setIsCompanySelected] = useState(true);

  // Vars
  const darkImg = '/images/pages/auth-v2-mask-dark.png';
  const lightImg = '/images/pages/auth-v2-mask-light.png';
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png';
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png';
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png';
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png';

  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang: locale } = useParams();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: valibotResolver(schema),

  });

  const authBackground = useImageVariant(mode, lightImg, darkImg);

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  );

  const handleOpenSelectCompany = async (email, password) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/checkLogin/${email}/${password}`);
      setIsUsernameValid(true);
      console.log(response.data.result);
      setLoginDetailsData(response.data.result);
      const Tables = response.data.result;
      /* const tableswithCRUD = Tables.map(item => item.table);
      console.log(tableswithCRUD); */

      const crudOperations = Tables.map(item => ({
        table: item.table,
        create: item.create,
        read: item.read,
        update: item.update,
        delete: item.delete,
      }));

      setcrudPermission(crudOperations);
      console.log(crudOperations);

      const uniqueDbNames = [...new Set(Tables.map(item => item.dbName))];
      setSchemaList(uniqueDbNames);
      /* const tableNames = Tables.map(item => item.table);
      console.log(tableNames);  */
      setOpen(true);
      localStorage.setItem('loggedIn', 'false');

      debugger;

      if (response.data.isPassValid) {
        const userDetails = response.data.result[0];
        // Password is valid, proceed with the login logic
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('loginUsername', userDetails.username);
        localStorage.setItem('loginEmail', userDetails.email);
        localStorage.setItem('role', userDetails.Rolecode);

        setUserName(userDetails.username);
        setRole(userDetails.Rolecode);

        if (userDetails.Rolecode === 'SA') {
          setIsSuperAdmin(true);
        } else {
          setIsSuperAdmin(false);
        }


      } else {
        // Password is not valid
        setIsPassvalid(response.data.isPassValid);
        setPassword('');

      }
    } catch (error) {
      setIsUsernameValid(false);
      console.error('Error during login:', error);
      //alert('An error occurred during login. Please try again.');
    }
  };

  const handleSelectCompany = (companyname) => {
    localStorage.removeItem('company');
    localStorage.setItem('company', companyname);
    setCompany(companyname);
    setIsCompanySelected(true);
  };

  const handleClickShowPassword = () => setIsPasswordShown(show => !show);

  const onSubmit = async data => {

    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    });

    if (res && res.ok && res.error === null) {
      // Vars
      const redirectURL = searchParams.get('redirectTo') ?? '/';

      router.push(getLocalizedUrl(redirectURL, locale));
    } else {
      if (res?.error) {
        const error = JSON.parse(res.error);

        setErrorState(error);
      }
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

  return (
    <div className='flex bs-full justify-center'>
      <div className='flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden'>
        <div className='plb-12 pis-12'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[500px] max-is-full bs-auto'
          />
        </div>
        <Illustrations
          image1={{ src: '/images/illustrations/objects/tree-2.png' }}
          image2={null}
          maskImg={{ src: authBackground }}
        />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <div className='flex justify-center items-center gap-3 mbe-6'>
            <Logo className='text-primary' height={28} width={35} />
            <Typography variant='h4' className='font-semibold tracking-[0.15px]'>
              {themeConfig.templateName}
            </Typography>
          </div>
        </div>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>
          <div>
            <Typography variant='h4'>{`Welcome to Dynamic Input Screen!👋🏻`}</Typography>
            <Typography>Please sign-in</Typography>
          </div>
          {/* <Alert icon={false} className='bg-[var(--mui-palette-primary-lightOpacity)]'>
            <Typography variant='body2' color='primary'>
              Email: <span className='font-medium'>admin@materio.com</span> / Pass:{' '}
              <span className='font-medium'>admin</span>
            </Typography>
          </Alert> */}

          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
                  type='email'
                  label='Email'
                  onChange={e => {
                    field.onChange(e.target.value);
                    errorState !== null && setErrorState(null);
                  }}
                  {...((errors.email || errorState !== null) && {
                    error: true,
                    helperText: errors?.email?.message || errorState?.message[0]
                  })}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Password'
                  id='login-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  onChange={e => {
                    field.onChange(e.target.value);
                    errorState !== null && setErrorState(null);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={e => e.preventDefault()}
                          aria-label='toggle password visibility'
                        >
                          <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...(errors.password && { error: true, helperText: errors.password.message })}
                />
              )}
            />
            <div className='flex justify-between items-center flex-wrap gap-x-3 gap-y-1'>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' />
              <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
                Forgot password?
              </Typography>
            </div>


            <Button fullWidth variant='contained' onClick={() => handleOpenSelectCompany(getValues('email'), getValues('password'))}>
              SELECT COMPANY
            </Button>

            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={open}
              onClose={handleClose}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  timeout: 500,
                },
              }}
            >
              <Fade in={open}>
                <Box sx={style}>
                  <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
                    Select Company
                  </Typography>

                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="demo-simple-select-label">Company</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Company"
                      onChange={(e) => handleSelectCompany(e.target.value)}
                    >
                      <MenuItem value="">Select Company</MenuItem>
                      {/*  {isSuperAdmin && (
                        <MenuItem value="control management">Control Management</MenuItem>
                      )} */}
                      {schemaList.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ marginTop: 2 }}> {/* Add space above the button */}

                    <Button fullWidth variant='contained' onClick={handleSubmit(onSubmit)}>
                      Log In
                    </Button>

                  </Box>
                </Box>
              </Fade>

            </Modal>


          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
