"use client"

import { Buffer } from 'buffer';

import React, { useState, useEffect } from 'react';


//import logo from '../Content/Images/mainlogo.png'; // Adjust the path to your logo file
//import { toast, ToastContainer } from 'react-toastify';
//import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Job_Exit_form.css';

import { getDate } from 'date-fns';

import { useRouter } from 'next/router';

import Button from '@mui/material/Button'

import { usePathname, useSearchParams } from 'next/navigation';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormGroup, FormControlLabel, Container } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

import SignaturePad from 'react-signature-canvas';



const JobExitComponent = () => {

    /* const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); */

    const searchParams = useSearchParams(); // Use useSearchParams() hook
    const id = searchParams.get('id');


    //console.log('exit id',id); // Check if id is correctly extracted


    const jobFields = ['Promotional Opportunities', 'Position Rotations', 'Increased Responsibilities', 'Special Projects', 'Overseas', 'Not Looking for any Progression', 'Others'];
    const radioOptions = ['1', '2', '3', '4', '5'];
    const [check, setCheck] = useState('');
    const [checkColumn, setCheckColumn] = useState('career_ops_imp_to_you');
    const [signature, setSignature] = useState('signature');
    const [isError, setIsError] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [sign, setSign] = useState();
    const [signatureBlob, setSignatureBlob] = useState('');
    const [startDate, setStartDate] = useState();
    const [sepDate, setSepDate] = useState();
    const [lenServiceDate, setLenServiceDate] = useState();
    const [lastDate, setLastDate] = useState();
    const [jobFields2, setSelectedJobfields] = useState([]);





    const [editExitFormData, setEditExitFormData] = useState([]);

    const [url, setUrl] = useState();



    const handleClear = () => {
        sign.clear();
    };

    const [formData, setFormData] = useState({
        Master: {
            employee_first_name: '',
            employee_last_name: '',
            job_title: '',
            start_date: '',
            seperation_date: '',
            len_of_service: '',
            reason_leaving: '',
            accept_another_pos: '',
            seek_another_job: '',
            searching_another_job: '',
            new_job_more_than_pos: '',
            career_goals_be_better: '',
            spoken_abt_career_goals: '',
            adequate_career_opportunities: '',
            career_ops_imp_to_you: '',
            job_responsibilites: '',
            ops_achieveing_goals: '',
            work_environment: '',
            director_manager: '',
            pay: '',
            benefits: '',
            most_enjoy_abt_job: '',
            least_enjoy_abt_job: '',
            good_place_work: '',
            poor_place_work: '',
            better_place_work: '',
            satisfactory_arrangement: '',
            Date: ''

        }
    });



    const generatePDF = () => {
        //window.print();
    };

    const handleInputChange = (value, name) => {
        debugger;

        if (id !== null) {
            setEditExitFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                Master: {
                    ...prevState.Master,
                    [name]: value
                }
            }));
        }

    };

    const handleCheckChange = (e, value) => {

        const { checked } = e.target;

        console.log(checked, value);

        if (id !== null) {
            if (!checked) {
                setEditExitFormData(prevState => ({
                    ...prevState,
                    career_ops_imp_to_you: prevState.career_ops_imp_to_you.filter(item => item !== value)
                }))
            } else {
                setEditExitFormData(prevState => ({
                    ...prevState,
                    career_ops_imp_to_you: [...prevState.career_ops_imp_to_you, value]
                }))
            }
        } else {
            let updatedValues = '';

            if (checked) {
                // If the checkbox is checked, add the value to the list
                updatedValues = check ? `${check},${value}` : value;
            } else {
                // If the checkbox is unchecked, remove the value from the list
                updatedValues = check
                    .split(',')
                    .filter((job) => job !== value)
                    .join(',');
            }

            setCheck(updatedValues);
            console.log('check', check);
        }


    };

    const getExitFormData = async () => {

        try {
            const responseUpdateData = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/GetExitFormData/${id}`);

            const originalStartDateString = responseUpdateData.data[0].start_date;
            const Startdate = new Date(originalStartDateString);

            // Format the date as YYYY-MM-DD
            const formattedStartDate = Startdate.toISOString().split('T')[0];

            setStartDate(formattedStartDate);

            const originalSepDateString = responseUpdateData.data[0].seperation_date;
            const Sepdate = new Date(originalSepDateString);

            // Format the date as YYYY-MM-DD
            const formattedSepDate = Sepdate.toISOString().split('T')[0];

            setSepDate(formattedSepDate);


            /* const originalLenServiceDateString = responseUpdateData.data[0].len_of_service;
            const LenServicedate = new Date(originalLenServiceDateString);

            // Format the date as YYYY-MM-DD
            const formattedLenServiceDate = LenServicedate.toISOString().split('T')[0];
            setLenServiceDate(formattedLenServiceDate); */

            const originalLastDateString = responseUpdateData.data[0].Date;
            const Lastdate = new Date(originalLastDateString);

            // Format the date as YYYY-MM-DD
            const formattedLastDate = Lastdate.toISOString().split('T')[0];

            setLastDate(formattedLastDate);

            responseUpdateData.data[0].start_date = formattedStartDate;

            responseUpdateData.data[0].seperation_date = formattedSepDate;

            //responseUpdateData.data[0].len_of_service = formattedLenServiceDate;

            responseUpdateData.data[0].Date = formattedLastDate;


            //console.log('selected jobs', responseUpdateData.data[0].career_ops_imp_to_you)
            const careerOpsString = responseUpdateData.data[0].career_ops_imp_to_you;

            // Split the string into an array using commas as the delimiter
            const opportunitiesArray = careerOpsString.split(',');

            responseUpdateData.data[0].career_ops_imp_to_you = opportunitiesArray;
            console.log('exit form data', responseUpdateData.data[0]);
            console.log('adequate career opportunities:', responseUpdateData.data[0].adequate_career_opportunities);
            setEditExitFormData(responseUpdateData.data[0]);

            //setSelectedJobfields(opportunitiesArray);
            console.log('new job fields', opportunitiesArray);

            opportunitiesArray.map((item) => {
                jobFields2.push(item)
            });


            const imageBuffer = responseUpdateData.data[0].signature;
            const base64Data = Buffer.from(imageBuffer).toString('base64');
            const decodedData = atob(base64Data);

            setSignatureBlob(decodedData);

            console.log('base64', decodedData);


        } catch (error) {
            console.log('error', error);
        }
    }


    const handleSubmit = () => {




        setUrl(sign.getTrimmedCanvas().toDataURL('image/png'));
        setFormData((prevState) => ({
            ...prevState,
            Master: {
                ...prevState.Master,
                [checkColumn]: check,
            },
        }));
        setFormData((prevState) => ({
            ...prevState,
            Master: {
                ...prevState.Master,
                [signature]: sign.getTrimmedCanvas().toDataURL('image/png'),
            },
        }));
        setFormSubmitted(true);
    };

    const InsertFormData = async (newFormData) => {

        console.log('Submit data', newFormData);

        try {
            const responseInsertData = await axios.post(process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/InsertExitFormData', {
                FormData: newFormData
            });

            setIsSaved(true);

        } catch (error) {
            console.log('error');
            setIsSaved(false);
        }
    };

    const UpdateFormData = async () => {

        console.log('check', check);
        const joinStringArray = editExitFormData.career_ops_imp_to_you.join(',');

        editExitFormData.career_ops_imp_to_you = joinStringArray;
        console.log('edit form data', editExitFormData)

        try {
            const responseUpdateData = await axios.post(process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/UpdateExitFormData', {
                FormData: editExitFormData
            });

            setIsSaved(true);

        } catch (error) {
            console.log('error');
            setIsSaved(false);
        }
    }


    useEffect(() => {
        const id = searchParams.get('id');

        if (id !== null) {
            getExitFormData(id);
        }

        if (formSubmitted) {

            console.log('formdata', formData);
            console.log('blob', url);

            const mandatoryFields = [
                'employee_first_name', 'employee_last_name', 'job_title',
                'start_date', 'seperation_date', 'len_of_service', 'reason_leaving',
                'accept_another_pos', 'seek_another_job', 'searching_another_job',
                'new_job_more_than_pos', 'career_goals_be_better', 'spoken_abt_career_goals',
                'adequate_career_opportunities', 'career_ops_imp_to_you', 'job_responsibilites',
                'ops_achieveing_goals', 'work_environment', 'director_manager', 'pay', 'benefits',
                'most_enjoy_abt_job', 'least_enjoy_abt_job', 'good_place_work', 'poor_place_work',
                'better_place_work', 'satisfactory_arrangement', 'Date'

            ];

            for (const field of mandatoryFields) {
                if (!formData.Master[field]) {
                    setIsError(true);

                    /* toast.error(`Please fill in the required fields`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    }); */

                    if (field === 'job_responsibilites' || field === 'ops_achieveing_goals' || field === 'work_environment' || field === 'director_manager' || field === 'pay' || field === 'benefits') {
                        /*  toast.error(`Please check ${field.replace(/_/g, ' ')}`, {
                             position: "top-center",
                             autoClose: 5000,
                             hideProgressBar: false,
                             closeOnClick: true,
                             pauseOnHover: true,
                             draggable: true,
                             progress: undefined,
                             theme: "dark",
                         }); */
                    }

                    setFormSubmitted(false);
                    
return;
                }
            }


            InsertFormData(formData);
        }
    }, [formData, formSubmitted, searchParams]);

    const commonStyles = {
        bgcolor: 'background.paper',
        m: 1,
        border: 2,
        width: '100%',
        padding: '20px'

    };


    return (
        <Container maxWidth="lg">
            {/* <ToastContainer /> */}
            <Grid container>
                {/* <Col md={12} className='text-center mb-4'>
                    <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: '200px' }} />
                </Col> */}
            </Grid>
            {!isSaved ? (
                <Grid container style={{ paddingTop: '20px' }}>
                    <Grid item md={12}>
                        <Typography variant='h4' style={{ textAlign: 'center', paddingBottom: '20px' }}>EMPLOYEE EXIT INTERVIEW</Typography>
                    </Grid>
                    {/* <Col md={12} style={{ textAlign: 'left' }}>
                        <h5>Purpose</h5>
                        <p>The intent of this Exit Interview is to ensure that any employee is informed of his/her rights,
                            benefits, and the records are collected and maintained regarding the termination of employment.
                        </p>
                        <h5>Policy</h5>
                        <p>
                            It is the policy of Easy Outdesk Company to ensure that any employee whose employment is being terminated, whether voluntary or involuntarily, receives an exit interview.
                            The exit interview shall be conducted by Sharon Williams and/ or Natalia Winfree. The objectives of the exit interview are as follows:
                        </p>
                        <h5>Policy</h5>
                        <p>
                            It is the policy of Easy Outdesk Company to ensure that any employee whose employment is being terminated, whether voluntary or involuntarily, receives an exit interview.
                            The exit interview shall be conducted by Sharon Williams and/ or Natalia Winfree. The objectives of the exit interview are as follows:
                        </p>
                        <ul>
                            <li>To determine and discuss the employee’s reason for resignation, if applicable.</li>
                            <li>To discover and discuss any misunderstandings the employee may have had about his/her job or with his/her manager.</li>
                            <li>To maintain good will and teamwork amongst current and future employees.</li>
                            <li>To review administrative details with the employee such as benefit continuation rights and conversion privileges,
                                if any, final pay, re-employment policy, and employment compensation.</li>
                            <li>To review administrative details with the employee such as benefit continuation rights and conversion privileges,
                                if any, final pay, re-employment policy, and employment compensation.</li>
                        </ul>
                        <h5>Procedure</h5>
                        <p>Upon an employee’s announcement of his/her intent to resign, the project director or manager shall schedule an exit interview for the employee with Sharon Williams or Natalia Winfree as soon as possible.</p>

                        <p> In the event that a decision has been made to terminate an employee, the employee shall meet with Sharon Williams or Natalia Winfree for an exit interview as soon as possible, or as deemed appropriate.</p>

                        <p> Throughout the duration of the exit interview, Sharon Williams or Natalia Winfree shall seek to meet all objectives listed within the exit interview policy.</p>

                        <p>The departing employee shall complete the following exit interview form as thoroughly as possible.</p>

                        <p> Any information obtained during the exit interview may be disclosed to and/or discussed with the employee manager, the project Director and Partners, as deemed necessary, in order to investigate any allegations made or to inform them of any emerging problems.</p>
                        <h4>REMINDERS</h4>
                        <p>Please remember that your work with Easy Outdesk Company was completed under a non-disclousure agreement. We highly value client confidentiality and all terms of the agreement. Feel free to request a copy for your reference if you do not already have one.</p>
                        <p>All Easy Outdesk Company equipment must be returned to the main office in order to received final payment.</p>
                    </Col> */}
                    <Grid container>
                        <div>
                            <Grid container >
                                {/* First Name and Last Name */}
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>Employee First Name</Typography>
                                            <TextField

                                                variant="outlined"
                                                fullWidth
                                                value={id === null ? null : editExitFormData.employee_first_name}
                                                onChange={(e) => handleInputChange(e.target.value, 'employee_first_name')}
                                                error={isError && formData.Master.employee_first_name === ''}
                                                helperText={isError && formData.Master.employee_first_name === '' ? "This field is required" : ""}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>Employee Last Name</Typography>
                                            <TextField

                                                variant="outlined"
                                                fullWidth
                                                value={id === null ? null : editExitFormData.employee_last_name}
                                                onChange={(e) => handleInputChange(e.target.value, 'employee_last_name')}
                                                error={isError && formData.Master.employee_last_name === ''}
                                                helperText={isError && formData.Master.employee_last_name === '' ? "This field is required" : ""}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Job Title */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>Job Title</Typography>
                                    <TextField

                                        variant="outlined"
                                        fullWidth
                                        value={id === null ? null : editExitFormData.job_title}
                                        onChange={(e) => handleInputChange(e.target.value, 'job_title')}
                                        error={isError && formData.Master.job_title === ''}
                                        helperText={isError && formData.Master.job_title === '' ? "This field is required" : ""}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} style={{ paddingTop: '15px' }}>
                                {/* Start Date */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>Start Date</Typography>
                                    <TextField

                                        type="date"
                                        fullWidth
                                        value={id === null ? null : editExitFormData.start_date}
                                        onChange={(e) => handleInputChange(e.target.value, 'start_date')}
                                        error={isError && formData.Master.start_date === ''}
                                        helperText={isError && formData.Master.start_date === '' ? "This field is required" : ""}
                                    />
                                </Grid>

                                {/* Separation Date and Total Length of Service */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>Separation Date</Typography>
                                    <TextField

                                        type="date"
                                        fullWidth
                                        value={id === null ? null : editExitFormData.seperation_date}
                                        onChange={(e) => handleInputChange(e.target.value, 'seperation_date')}
                                        error={isError && formData.Master.seperation_date === ''}
                                        helperText={isError && formData.Master.seperation_date === '' ? "This field is required" : ""}
                                        style={{ paddingTop: '15px' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>Total Length of Service</Typography>
                                    <TextField

                                        type="text"
                                        fullWidth
                                        value={id === null ? null : editExitFormData.len_of_service}
                                        onChange={(e) => handleInputChange(e.target.value, 'len_of_service')}
                                        error={isError && formData.Master.len_of_service === ''}
                                        helperText={isError && formData.Master.len_of_service === '' ? "This field is required" : ""}
                                        style={{ paddingTop: '15px' }}
                                    />
                                </Grid>

                                {/* Reason for Leaving */}


                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>Reason for Leaving</Typography>
                                    <TextField
                                        multiline
                                        rows={3}
                                        fullWidth
                                        value={id === null ? null : editExitFormData.reason_leaving}
                                        onChange={(e) => handleInputChange(e.target.value, 'reason_leaving')}
                                        error={isError && formData.Master.reason_leaving === ''}
                                        helperText={isError && formData.Master.reason_leaving === '' ? "This field is required" : ""}
                                        style={{ paddingTop: '15px' }}
                                    />

                                </Grid>


                            </Grid>

                            <Grid container spacing={2} style={{ paddingTop: '20px' }}>
                                <Typography variant='h5' style={{ textAlign: 'left' }}>REASONS FOR LEAVING</Typography>

                                <Grid item xs={12} style={{ paddingTop: '15px' }}>
                                    <Typography style={{ textAlign: 'left', fontWeight: 'bold', paddingBottom: '10px' }}>Have you accepted another position?</Typography>
                                    <FormControl fullWidth error={isError && formData.Master.accept_another_pos === ''}>
                                        <InputLabel id="accept_another_pos-label">Select an option</InputLabel>
                                        <Select
                                            label='Select an option'
                                            labelId='accept_another_pos-label'
                                            fullWidth
                                            value={
                                                id === null
                                                    ? formData['Master'].accept_another_pos
                                                    : (editExitFormData.accept_another_pos ? editExitFormData.accept_another_pos.toString().toLowerCase() : '') // Check if editExitFormData.accept_another_pos is defined
                                            }
                                            onChange={(e) => handleInputChange(e.target.value, 'accept_another_pos')}
                                            error={isError && formData.Master.accept_another_pos === ''}
                                        >

                                            <MenuItem value="">Please Select</MenuItem>
                                            <MenuItem value="yes">Yes</MenuItem>
                                            <MenuItem value="no">No</MenuItem>
                                        </Select>
                                        <FormHelperText error={isError && formData.Master.accept_another_pos === ''}>
                                            {isError && formData.Master.accept_another_pos === '' ? "This field is required" : ""}
                                        </FormHelperText>
                                    </FormControl>

                                </Grid>

                                <Grid item xs={12} style={{ paddingTop: '20px' }}>

                                    <Typography style={{ textAlign: 'left', fontWeight: 'bold' }}>What prompted you to seek another job?</Typography>
                                    <TextField
                                        fullWidth
                                        rows={3}
                                        value={id === null ? null : editExitFormData.seek_another_job}
                                        error={isError && formData.Master.seek_another_job === ''}
                                        onChange={(e) => handleInputChange(e.target.value, 'seek_another_job')}
                                        helperText={isError && 'This field is required'}
                                    />

                                </Grid>


                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>When did you begin searching for another job?</Typography>
                                    <TextField
                                        multiline
                                        rows={3}

                                        fullWidth
                                        value={id === null ? null : editExitFormData.searching_another_job}
                                        onChange={(e) => handleInputChange(e.target.value, 'searching_another_job')}
                                        error={isError && formData.Master.searching_another_job === ''}
                                        helperText={isError && formData.Master.searching_another_job === '' ? "This field is required" : ""}
                                        style={{ paddingTop: '20px' }}
                                    />

                                </Grid>



                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>What makes the new job more attractive than your current position?</Typography>

                                    <TextField
                                        multiline
                                        rows={3}

                                        fullWidth
                                        value={id === null ? null : editExitFormData.new_job_more_than_pos}
                                        onChange={(e) => handleInputChange(e.target.value, 'new_job_more_than_pos')}
                                        error={isError && formData.Master.new_job_more_than_pos === ''}
                                        helperText={isError && formData.Master.new_job_more_than_pos === '' ? "This field is required" : ""}
                                        style={{ paddingTop: '20px' }}
                                    />
                                </Grid>





                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>What made you decide that your career goals could be better achieved elsewhere?</Typography>

                                    <TextField
                                        multiline
                                        rows={3}

                                        fullWidth
                                        value={id === null ? null : editExitFormData.career_goals_be_better}
                                        onChange={(e) => handleInputChange(e.target.value, 'career_goals_be_better')}
                                        error={isError && formData.Master.career_goals_be_better === ''}
                                        helperText={isError && formData.Master.career_goals_be_better === '' ? "This field is required" : ""}
                                        style={{ paddingTop: '20px' }}
                                    />
                                </Grid>




                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>Have you spoken with anyone, either your director or any of the partners about your career goals?</Typography>
                                    <TextField
                                        multiline
                                        rows={3}
                                        fullWidth
                                        value={id === null ? null : editExitFormData.spoken_abt_career_goals}
                                        onChange={(e) => handleInputChange(e.target.value, 'spoken_abt_career_goals')}
                                        error={isError && formData.Master.spoken_abt_career_goals === ''}
                                        helperText={isError && formData.Master.spoken_abt_career_goals === '' ? "This field is required" : ""}
                                        style={{ paddingTop: '20px' }}
                                    />

                                </Grid>



                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold', paddingBottom: '10px' }}>In your opinion, have there been adequate career opportunities available within company?</Typography>

                                    <FormControl fullWidth error={isError && formData.Master.adequate_career_opportunities === ''}>
                                        <InputLabel id="adequate_career_opportunities-label">Select an option</InputLabel>
                                        <Select
                                            labelId='adequate_career_opportunities-label'
                                            label='Select an option'

                                            value={
                                                id === null
                                                    ? formData['Master'].adequate_career_opportunities
                                                    : (editExitFormData.adequate_career_opportunities ? editExitFormData.adequate_career_opportunities.toString().toLowerCase() : '') // Check if editExitFormData.accept_another_pos is defined
                                            }

                                            onChange={(e) => handleInputChange(e.target.value, 'adequate_career_opportunities')}
                                        >
                                            <MenuItem value="">Please Select</MenuItem>
                                            <MenuItem value="yes">Yes</MenuItem>
                                            <MenuItem value="no">No</MenuItem>
                                        </Select>
                                        {isError && formData.Master.adequate_career_opportunities === '' && <FormHelperText>This field is required</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                {/* Question 2 */}
                                <Grid item xs={12}>
                                    <FormControl component="fieldset" fullWidth error={isError && formData.Master.career_ops_imp_to_you === ''}>
                                        <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>
                                            What types of career opportunities are important to you? (Select all that apply)
                                        </Typography>
                                        {id === null ? (
                                            <FormGroup>
                                                {jobFields.map((job, index) => (
                                                    <FormControlLabel
                                                        key={index}
                                                        control={
                                                            <Checkbox
                                                                defaultChecked={editExitFormData.career_ops_imp_to_you !== undefined ? editExitFormData.career_ops_imp_to_you.includes(job) : false}
                                                                onChange={(e) => handleCheckChange(e, job)}
                                                                name={job}
                                                            />
                                                        }
                                                        label={job}
                                                    />
                                                ))}
                                            </FormGroup>
                                        ) : (
                                            <FormGroup>
                                                {jobFields.map((job, index) => (
                                                    <FormControlLabel
                                                        key={index}
                                                        control={
                                                            <Checkbox
                                                                checked={editExitFormData.career_ops_imp_to_you !== undefined ? editExitFormData.career_ops_imp_to_you.includes(job) : false}
                                                                onChange={(e) => handleCheckChange(e, job)}
                                                                name={job}
                                                            />
                                                        }
                                                        label={job}
                                                    />
                                                ))}
                                            </FormGroup>
                                        )}

                                        {isError && formData.Master.career_ops_imp_to_you === '' && <FormHelperText>This field is required</FormHelperText>}
                                    </FormControl>
                                </Grid>

                            </Grid>

                            {/* job satisfaction radios */}
                            <Grid container spacing={2} style={{ paddingTop: '20px' }}>
                                <Typography variant='h5' style={{ textAlign: 'left', paddingTop: '20px' }}>JOB SATISFACTION</Typography>
                                <Grid container >
                                    <Grid item xs={12} style={{ margin: '1rem' }}>

                                        <Typography style={{ textAlign: 'center', fontWeight: 'bold', paddingBottom: '10px' }}>Job Responsibilities</Typography>
                                        <Grid container style={{ justifyContent: 'center' }}>

                                            {radioOptions.map((option, index) => (

                                                <Grid item xs={2} md={2}>
                                                    <input type="radio"
                                                        name="jrRadio"
                                                        id={`jrRadio${option}`}

                                                        checked={editExitFormData.job_responsibilites === option ? true : null}
                                                        onChange={(e) => handleInputChange(option, "job_responsibilites")}  ></input>

                                                    <label htmlFor={`jrRadio${option}`} class="radioLable">{option}</label>
                                                    {index === 0 && (
                                                        <p>Unsatisfied</p>
                                                    )}

                                                    {index === radioOptions.length - 1 && (
                                                        <p>Outstanding</p>
                                                    )}

                                                </Grid>


                                            ))}


                                        </Grid>


                                    </Grid>
                                </Grid>

                                <Grid container >
                                    <Grid item xs={12} style={{ margin: '1rem' }}>

                                        <Typography style={{ textAlign: 'center', fontWeight: 'bold', paddingBottom: '10px' }}>Opportunity for Achieving Goals</Typography>
                                        <Grid container style={{ justifyContent: 'center' }}>

                                            {radioOptions.map((option, index) => (

                                                <Grid item xs={2} md={2}>
                                                    <input type="radio"
                                                        name="AGRadio"
                                                        id={`AGRadio${option}`}

                                                        checked={editExitFormData.ops_achieveing_goals === option ? true : null}
                                                        onChange={(e) => handleInputChange(option, "ops_achieveing_goals")}  ></input>

                                                    <label htmlFor={`AGRadio${option}`} class="radioLable">{option}</label>
                                                    {index === 0 && (
                                                        <p>Unsatisfied</p>
                                                    )}

                                                    {index === radioOptions.length - 1 && (
                                                        <p>Outstanding</p>
                                                    )}

                                                </Grid>


                                            ))}


                                        </Grid>


                                    </Grid>
                                </Grid>

                                <Grid container >
                                    <Grid item xs={12} style={{ margin: '1rem' }}>

                                        <Typography style={{ textAlign: 'center', fontWeight: 'bold', paddingBottom: '10px' }}>Work Environment</Typography>
                                        <Grid container style={{ justifyContent: 'center' }}>

                                            {radioOptions.map((option, index) => (

                                                <Grid item xs={2} md={2}>
                                                    <input type="radio"
                                                        name="WERadio"
                                                        id={`WERadio${option}`}
                                                        checked={editExitFormData.work_environment === option ? true : null}
                                                        onChange={(e) => handleInputChange(option, "work_environment")} ></input>

                                                    <label htmlFor={`WERadio${option}`} class="radioLable">{option}</label>
                                                    {index === 0 && (
                                                        <p>Unsatisfied</p>
                                                    )}

                                                    {index === radioOptions.length - 1 && (
                                                        <p>Outstanding</p>
                                                    )}

                                                </Grid>


                                            ))}


                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid container >
                                    <Grid item xs={12} style={{ margin: '1rem' }}>

                                        <Typography style={{ textAlign: 'center', fontWeight: 'bold', paddingBottom: '10px' }}>Director/ Manager</Typography>
                                        <Grid container style={{ justifyContent: 'center' }}>

                                            {radioOptions.map((option, index) => (

                                                <Grid item xs={2} md={2}>
                                                    <input type="radio"
                                                        name="DMRadio"
                                                        id={`DMRadio${option}`}
                                                        checked={editExitFormData.director_manager === option ? true : null}
                                                        onChange={(e) => handleInputChange(option, "director_manager")} ></input>

                                                    <label htmlFor={`DMRadio${option}`} class="radioLable">{option}</label>
                                                    {index === 0 && (
                                                        <p>Unsatisfied</p>
                                                    )}

                                                    {index === radioOptions.length - 1 && (
                                                        <p>Outstanding</p>
                                                    )}

                                                </Grid>


                                            ))}


                                        </Grid>
                                    </Grid>
                                </Grid>


                                <Grid container >
                                    <Grid item xs={12} style={{ margin: '1rem' }}>

                                        <Typography style={{ textAlign: 'center', fontWeight: 'bold', paddingBottom: '10px' }}>Pay</Typography>
                                        <Grid container style={{ justifyContent: 'center' }}>

                                            {radioOptions.map((option, index) => (

                                                <Grid item xs={2} md={2}>
                                                    <input type="radio"
                                                        name="PRadio"
                                                        id={`PRadio${option}`}
                                                        checked={editExitFormData.pay === option ? true : null}
                                                        onChange={(e) => handleInputChange(option, "pay")} ></input>

                                                    <label htmlFor={`PRadio${option}`} class="radioLable">{option}</label>
                                                    {index === 0 && (
                                                        <p>Unsatisfied</p>
                                                    )}

                                                    {index === radioOptions.length - 1 && (
                                                        <p>Outstanding</p>
                                                    )}

                                                </Grid>


                                            ))}


                                        </Grid>
                                    </Grid>
                                </Grid>


                                <Grid container >
                                    <Grid item xs={12} style={{ margin: '1rem' }}>

                                        <Typography style={{ textAlign: 'center', fontWeight: 'bold', paddingBottom: '10px' }}>Benefits</Typography>
                                        <Grid container style={{ justifyContent: 'center' }}>

                                            {radioOptions.map((option, index) => (

                                                <Grid item xs={2} md={2}>
                                                    <input type="radio"
                                                        name="BRadio"
                                                        id={`BRadio${option}`}
                                                        checked={editExitFormData.benefits === option ? true : null}
                                                        onChange={(e) => handleInputChange(option, "benefits")} ></input>

                                                    <label htmlFor={`BRadio${option}`} class="radioLable">{option}</label>
                                                    {index === 0 && (
                                                        <p>Unsatisfied</p>
                                                    )}

                                                    {index === radioOptions.length - 1 && (
                                                        <p>Outstanding</p>
                                                    )}

                                                </Grid>


                                            ))}


                                        </Grid>
                                    </Grid>
                                </Grid>


                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>What did you enjoy most about your job?</Typography>
                                    <TextField
                                        multiline
                                        rows={3}
                                        fullWidth
                                        value={id === null ? null : editExitFormData.most_enjoy_abt_job}
                                        onChange={(e) => handleInputChange(e.target.value, 'most_enjoy_abt_job')}
                                        error={isError && formData.Master.most_enjoy_abt_job === ''}
                                        helperText={isError && formData.Master.most_enjoy_abt_job === '' ? 'This field is required' : ''}
                                    />
                                </Grid>



                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>What did you enjoy least about your job?</Typography>
                                    <TextField
                                        multiline
                                        rows={3}
                                        fullWidth
                                        value={id === null ? null : editExitFormData.least_enjoy_abt_job}
                                        onChange={(e) => handleInputChange(e.target.value, 'least_enjoy_abt_job')}
                                        error={isError && formData.Master.least_enjoy_abt_job === ''}
                                        helperText={isError && formData.Master.least_enjoy_abt_job === '' ? 'This field is required' : ''}
                                    />
                                </Grid>



                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>What makes EASY OUTDESK a good place to work?</Typography>
                                    <TextField
                                        multiline
                                        rows={3}
                                        fullWidth
                                        value={id === null ? null : editExitFormData.good_place_work}
                                        onChange={(e) => handleInputChange(e.target.value, 'good_place_work')}
                                        error={isError && formData.Master.good_place_work === ''}
                                        helperText={isError && formData.Master.good_place_work === '' ? 'This field is required' : ''}
                                    />
                                </Grid>



                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>What makes the company a poor place to work?</Typography>
                                    <TextField
                                        multiline
                                        rows={3}
                                        fullWidth
                                        value={id === null ? null : editExitFormData.poor_place_work}
                                        onChange={(e) => handleInputChange(e.target.value, 'poor_place_work')}
                                        error={isError && formData.Master.poor_place_work === ''}
                                        helperText={isError && formData.Master.poor_place_work === '' ? 'This field is required' : ''}
                                    />
                                </Grid>



                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold' }}>What recommendation would you have for making the company as a whole a better place to work?</Typography>
                                    <TextField
                                        multiline
                                        rows={3}
                                        fullWidth
                                        value={id === null ? null : editExitFormData.better_place_work}
                                        onChange={(e) => handleInputChange(e.target.value, 'better_place_work')}
                                        error={isError && formData.Master.better_place_work === ''}
                                        helperText={isError && formData.Master.better_place_work === '' ? 'This field is required' : ''}
                                    />
                                </Grid>



                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'left', fontWeight: 'bold', paddingBottom: '10px' }}>Would you have stayed if a more satisfactory arrangement could have been worked out?</Typography>
                                    <FormControl fullWidth error={isError && formData.Master.satisfactory_arrangement === ''}>
                                        <InputLabel id="satisfactory-arrangement-label">Select an option</InputLabel>
                                        <Select
                                            labelId="satisfactory-arrangement-label"
                                            label="Select an option"
                                            id='satisfactory_arrangement_select'
                                            error={isError && formData.Master.satisfactory_arrangement === ''}
                                            value={
                                                id === null
                                                    ? formData['Master'].satisfactory_arrangement
                                                    : (editExitFormData.satisfactory_arrangement ? editExitFormData.satisfactory_arrangement.toString().toLowerCase() : '') // Check if editExitFormData.accept_another_pos is defined
                                            }
                                            onChange={(e) => handleInputChange(e.target.value, 'satisfactory_arrangement')}
                                        >
                                            <MenuItem value="">Please Select</MenuItem>
                                            <MenuItem value="yes">Yes</MenuItem>
                                            <MenuItem value="no">No</MenuItem>
                                        </Select>
                                        {isError && formData.Master.satisfactory_arrangement === '' && <FormHelperText >This field is required</FormHelperText>}
                                    </FormControl>
                                </Grid>




                                <Grid item xs={12} style={{ paddingTop: '20px' }}>
                                    <Typography variant="body1">
                                        Please sign and date this form below authorizing the placement of this Exit Interview form within your personal file.
                                    </Typography>
                                </Grid>


                                <Grid container spacing={2} style={{ paddingTop: '20px' }}>
                                    <Grid item xs={12} md={6} style={{ paddingTop: '20px' }}>

                                        <TextField
                                            type="date"
                                            value={id === null ? null : editExitFormData.Date}
                                            onChange={(e) => handleInputChange(e.target.value, 'Date')}
                                            variant="outlined"
                                            fullWidth
                                            error={isError && formData.Master.Date === ''}
                                            helperText={isError && formData.Master.Date === '' && "This field is required"}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h5" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                            Signature
                                        </Typography>
                                        <Box sx={{ ...commonStyles, justifyContent: 'center', borderColor: 'primary.main', maxWidth: '400px', margin: 'auto' }}>

                                            {id !== null ? (
                                                <img src={signatureBlob} alt="Base64 Image" />
                                            ) : <SignaturePad
                                                canvasProps={{ className: 'sigCanvas', style: { maxWidth: '100%' } }}
                                                ref={data => setSign(data)}
                                            />}
                                        </Box>
                                        <div style={{ textAlign: 'end', marginTop: '10px' }}>
                                            <Button variant="outlined" onClick={handleClear}>Clear</Button>
                                        </div>
                                    </Grid>
                                </Grid>

                            </Grid>



                        </div>
                        {id !== null && (
                            <Button onClick={generatePDF}>Export PDF</Button>
                        )}
                        <Grid item xs={12} style={{ paddingTop: '20px' }}>
                            <Button variant='contained' style={{ width: '100%' }} onClick={id !== null ? UpdateFormData : handleSubmit}>
                                SUBMIT
                            </Button>
                        </Grid>

                    </Grid>
                </Grid>


            ) :
                (
                    <>
                        <div style={{ textAlign: 'center', color: 'green', fontSize: '1.5rem' }}>
                            <p>Thank you for submitting your application.</p>
                            <p>We have received it successfully.</p>
                            <p style={{ marginTop: '10px' }}>Our team will review your submission and get back to you shortly. Have a great day!</p>
                        </div>
                    </>

                )}
        </Container>


    );
};

export default JobExitComponent;