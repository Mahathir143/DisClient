"use client"

import React, { useState, useEffect } from 'react';

//import logo from '../Content/Images/mainlogo.png'; // Adjust the path to your logo file
//import { toast, ToastContainer } from 'react-toastify';

import { usePathname, useSearchParams } from 'next/navigation';

import axios from 'axios';
import Button from '@mui/material/Button'
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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormGroup, FormControlLabel, Container, Input } from '@mui/material';

import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


const FormComponent = () => {

    //debugger;

    const pathname = usePathname(); // Use usePathname() hook
    const searchParams = useSearchParams(); // Use useSearchParams() hook
    const id = searchParams.get('id');

    console.log('new id', id);

    //const urlParams = new URLSearchParams(window.location.search);
    // Now you can safely use window and its properties
    //const id = undefined;

    /* const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); */

    const [deviceType, setDeviceType] = useState(getDeviceType());
    const [selectedFileName, setSelectedFileName] = useState('');
    const [fontSize, setFontSize] = useState('medium');
    const [fields, setFields] = useState([]);
    const [editData, setEditData] = useState([]);
    const [retrievedData, setRetrievedData] = useState([]);
    const [retrievedQualification, setretrievedQualification] = useState([]);
    const [qualificationDetails, setQualificationDetails] = useState([]);
    const [langDetails, setLangDetails] = useState([]);
    const [skillDetails, setSkillsDetails] = useState([]);
    const [urlId, setUrlId] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [applicationNo, setApplicationNo] = useState('');
    const [Submit, setSubmit] = useState('SUBMIT');
    const [Update, setUpdate] = useState('UPDATE');

    const [formData, setFormData] = useState({
        Master: {},
        Qualification: [
            { Qualification: 'HSC', Institution: '', Percentage_of_Marks: '', Year_of_passing: '' },
            { Qualification: 'SSLC', Institution: '', Percentage_of_Marks: '', Year_of_passing: '' },
        ],
        Language: [
            { Language: 'Tamil', lang_read: 0, lang_write: 0, lang_speak: 0 },
            { Language: 'English', lang_read: 0, lang_write: 0, lang_speak: 0 },
        ],
        Skills: []
    });

    // State variables to manage dynamic rows in qualification and language tables
    const [qualificationRows, setQualificationRows] = useState([
        { qualification: 'HSC' },
        { qualification: 'SSLC' },

    ]);

    const [languageRows, setLanguageRows] = useState([
        { language: 'Tamil' },
        { language: 'English' },

    ]);

    const [skillsRows, setSkillsRows] = useState([]);
    const [emailError, setEmailError] = useState(false);
    const [relationshipOptionsList, setRelationshipOptionsList] = useState([]);
    const [selectedFile, setSelectedFile] = useState([]);
    const [isFileselected, setIsfileSelected] = useState(false);

    const generatePDF = () => {
        // window.print();
    };

    const loadFields = async (tableName) => {

        try {
            //debugger;

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getFields/easy_outdesk/job_application_details`
            );

            // Assuming fields is an array of objects and you want to concatenate with the new data


            setFields(response.data);

            //setDefaultFields(response.data);
            console.log("new fields", response.data);
        } catch (error) {
            console.error('Error loading tables:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        
return date.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
    }

    const loadEditData = async () => {
        debugger;
        const newId = parseInt(id, 10);

        if (newId !== undefined) {
            try {

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getJobApplication/${id}`
                );

                // Assuming fields is an array of objects and you want to concatenate with the new data


                setEditData(response.data);
                console.log(response.data);
                console.log("edit", newId, response.data.find(item => item.id === newId))

                //setRetrievedData(response.data.find(item => item.id === newId));
                const editData = response.data.find(item => item.id === newId);
                const formatedDate = formatDate(editData.Date_of_Birth);
                const updatedDate = { ...editData, Date_of_Birth: formatedDate };

                setRetrievedData(updatedDate);
            } catch (error) {
                console.error('Error loading tables:', error);
            }
        }
    }

    const Qualification_details = async () => {
        debugger;
        const newId = parseInt(id, 10);

        try {

            const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getQualificationDetails/${newId}`);

            setQualificationDetails(response.data);
            setretrievedQualification(response.data);
            const sliceData = response.data.slice(2);

            console.log('slice data', sliceData);
            const NewArrayAdd = Array.from({ length: sliceData.length }, (_, index) => ({ qualification: 'Others' }));
            const newQualificationRows = [...qualificationRows, ...NewArrayAdd];

            setQualificationRows(newQualificationRows);
            console.log('new qualification', newQualificationRows);
            const array = [];

            array[0] = { qualification: 'Others' };

            /* setQualificationRows(prevRows => [
                ...prevRows,
                ...Array.from({ length: 3 }, (_, index) => ({qualification: 'Others' }))
            ]); */

            console.log("qualification table", response.data);
        } catch (error) {
            console.error('Error loading tables:', error);
        }
    };

    const language_details = async () => {
        const newId = parseInt(id, 10);

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getLanguageDetails/${newId}`);

            setLangDetails(response.data);
            const sliceData = response.data.slice(2);
            const NewArrayAdd = Array.from({ length: sliceData.length }, (_, index) => ({ language: 'Others' }));
            const newLanguageRows = [...languageRows, ...NewArrayAdd];

            setLanguageRows(newLanguageRows);

            /* setLanguageRows(prevRows => [
                ...prevRows,
                ...Array.from({ length: sliceData.length / sliceData.length }, (_, index) => ({ language: 'Others' }))
            ]); */
            console.log("language rows", newLanguageRows);
        } catch (error) {
            console.error('Error loading tables:', error);
        }
    };

    const loadSkillsDetails = async () => {

        const newId = parseInt(id, 10);

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getSkillsDetails/${newId}`
            );

            setSkillsDetails(response.data);
            console.log("skills details", response.data);
        } catch (error) {
            console.error('Error loading tables:', error);
        }
    };

    const loadSkillsMaster = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getSkillsMaster`
            );

            setSkillsRows(response.data);
            console.log("skills table", response.data);
        } catch (error) {
            console.error('Error loading tables:', error);
        }
    };




    const loadRelationDetails = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_REACT_APP_API_URL + `api/getRelationshipDetails/easy_outdesk/job_application_details`);

            fetchAllFieldRelations(response.data);
            console.log("relationShipDetails", response.data);
        } catch (error) {
            console.error('Error loading tables:', error);
        }
    };

    const loadPrimaryDataList = async (tableName, value, text) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/getPrimaryDataList/easy_outdesk/${tableName}/${value}/${text}`
            );

            
return response.data;
        } catch (error) {
            console.error('Error loading tables:', error);
            
return null;
        }
    };


    const openInNewTab = (url) => {

        console.log(url);
        const newWindow = window.open(`${url}`, '_blank');

        if (newWindow) {
            newWindow.opener = null; // Avoid security issues with cross-origin navigation
        }
    };


    const fetchAllFieldRelations = async (relationShipDetails) => {
        if (relationShipDetails && relationShipDetails.length > 0) {
            const optionsList = [];

            for (const field of relationShipDetails) {
                const primaryTableDataList = await loadPrimaryDataList(field.primary_table, field.Primary_Table_Value, field.Primary_Table_Text);
                const insideDataList = [];

                if (primaryTableDataList && primaryTableDataList.length > 0) {

                    primaryTableDataList.forEach((fieldInside) => {
                        const dataInside = {
                            value: fieldInside.value,
                            text: fieldInside.text,
                        };

                        insideDataList.push(dataInside);
                    });

                    const dataOption = {
                        column: field.Relation_Table_value,
                        dependency: field.Dependency_Value,
                        options: insideDataList,
                    };

                    optionsList.push(dataOption);
                }
            }

            //console.log('optionsList', optionsList);
            setRelationshipOptionsList(optionsList);
            console.log("relationshipOptionlist", relationshipOptionsList);


        }
    };

    const handleInputChange = (e, name) => {
        EmailValidate();
        const { value } = e.target;

        console.log(value, name);

        if (id !== null) {
            setRetrievedData(prevData => {
                if (!prevData) {
                    // If prevData is null or undefined, return the original state
                    return prevData;
                }

                if (prevData.hasOwnProperty(name)) {
                    // If the name is a direct property of retrievedData
                    return {
                        ...prevData,
                        [name]: value
                    };
                } else if (prevData.Master && prevData.Master.hasOwnProperty(name)) {
                    // If the name is a property of the Master object
                    return {
                        ...prevData,
                        Master: {
                            ...prevData.Master,
                            [name]: value
                        }
                    };
                } else {
                    // If the name is not found in direct properties or Master object, return the original state
                    return prevData;
                }
            });
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

    const handleLanguageCheckboxChange = (e, name, index) => {

        const { checked } = e.target;

        console.log(name, checked)

        if (id !== null) {
            // Update the langDetails array
            setLangDetails(prevData => {
                const updatedLangDetails = [...prevData];

                updatedLangDetails[index] = {
                    ...updatedLangDetails[index],
                    [name]: checked ? 1 : 0, // Convert boolean to 1 or 0
                };
                
return updatedLangDetails;
            });
        } else {
            const updatedValue = checked ? 1 : 0; // Set to '1' if checked, '' if unchecked

            setFormData(prevState => ({
                ...prevState,
                Language: prevState.Language.map((item, i) =>
                    i === index ? { ...item, [name]: updatedValue } : item
                )
            }));
        }


    };

    const handleCheckboxChange = (e, name, skill) => {
        const { checked, value } = e.target;
        
        if (id !== null) {
            setSkillsDetails(prevData => {
                // Check if the skill exists in the skillsDetails array
                const existingSkill = prevData.find(item => item.skill === skill);

                debugger;

                if (!existingSkill) {
                    // If the skill doesn't exist, add it with is_active: "1"
                    return [...prevData, { skill, is_active: checked ? "1" : "0" }];
                }

                // Update the is_active property based on the checkbox state
                return prevData.map(item =>
                    item.skill === skill ? { ...item, is_active: checked ? "1" : "0" } : item
                );
            });
        } else {
            if (checked) {
                setFormData(prevState => ({
                    ...prevState,
                    Skills: [...prevState.Skills, value]
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    Skills: prevState.Skills.filter(prevSkill => prevSkill !== value)
                }));
            }
        }
    };


    /* const handleCheckboxChange = (e, name, skill) => {
        const { checked, value } = e.target;
        if (id !== null) {
            setSkillsDetails(prevData => {
                const updatedSkillDetails = prevData.map(item => {
                    if (item.skill === skill) {
                        // Update the is_active property based on the checkbox state
                        return { ...item, is_active: checked ? "1" : "0" };
                    }
                    return item;
                });

                return updatedSkillDetails;
            });
        } else {
            if (checked) {
                setFormData(prevState => ({
                    ...prevState,
                    Skills: [...prevState.Skills, value]
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    Skills: prevState.Skills.filter(skill => skill !== value)
                }));
            }
        }


    }; */

    const handleQualificationChange = (e, name, index) => {

        const { value } = e.target;

        if (id !== null) {
            setretrievedQualification(prevData => {
                const newData = [...prevData];
                const updatedQualification = { ...newData[index], [name]: value };

                newData[index] = updatedQualification;
                
return newData;
            });
        } else {
            setFormData(prevState => ({
                ...prevState,
                Qualification: prevState.Qualification.map((item, i) =>
                    i === index ? { ...item, [name]: value } : item
                )
            }));
        }



    };

    const handleLanguageChange = (e, name, index) => {
        const { value } = e.target;

        if (id !== null) {
            setLangDetails((prevData) => {
                const updatedLangDetails = [...prevData];

                updatedLangDetails[index] = {
                    ...updatedLangDetails[index],
                    language: value,
                };
                
return updatedLangDetails;
            });
        } else {
            setFormData(prevState => ({
                ...prevState,
                Language: prevState.Language.map((item, i) =>
                    i === index ? { ...item, [name]: value } : item
                )
            }));
        }


    };

    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        setSelectedFileName(e.target.files[0].name)

        // Create a FormData object to send the file to the server
        const formdata = new FormData();

        formdata.append('file', selectedFile);

        if (id !== null) {
            formdata.append('Form', retrievedData.Full_Name);
            setSelectedFile(formdata);
            setIsfileSelected(true);
        } else {
            setIsfileSelected(true);
            formdata.append('Form', formData.Master.Full_Name);
            setSelectedFile(formdata);
        }


        // Do something with the selected file, for example, log its name
        console.log('Selected File:', selectedFile);
    };

    // Function to add a new row to the qualification table
    const addQualificationRow = () => {

        if (id != null) {
            setQualificationRows(prevRows => [...prevRows, { qualification: 'Others' }]);
            setretrievedQualification(prevRows => [...prevRows, { id: '', header_id: id, }]);

        } else {
            setQualificationRows(prevRows => [...prevRows, { qualification: 'Others' }]);
        }

        //setQualificationRows(prevRows => [...prevRows, { qualification: 'Others' }]);

        setFormData(prevFormData => ({
            ...prevFormData,
            Qualification: [
                ...prevFormData.Qualification,
                { Qualification: '', Institution: '', Percentage_of_Marks: '', Year_of_passing: '' }
            ]
        }));
    };

    const addLanguageRow = () => {
        if (id !== null) {
            setLanguageRows(prevRows => [...prevRows, { language: 'Others', lang_read: 0, lang_write: 0, lang_speak: 0 }]);
            setLangDetails(prevRows => [...prevRows, { id: '', header_id: id, language: '', lang_read: 0, lang_write: 0, lang_speak: 0 }]);
        } else {
            setLanguageRows(prevRows => [...prevRows, { language: 'Others', lang_read: 0, lang_write: 0, lang_speak: 0 }]);
        }


        setFormData(prevFormData => ({
            ...prevFormData,
            Language: [
                ...prevFormData.Language,
                { Language: '', lang_read: 0, lang_write: 0, lang_speak: 0 }
            ]
        }));

    };


    // Function to add a new row to the language table
    // const addLanguageRow = () => {
    //     setLanguageRows(prevRows => [...prevRows, { language: 'Others' }]);
    // };

    // Function to delete a row from the table
    const deleteRow = (index, type) => {
        if (type === 'qualification') {

            if (id !== null) {
                setretrievedQualification(prevRows => prevRows.filter((row, i) => i !== index));
                setQualificationRows(prevRows => prevRows.filter((row, i) => i !== index));
                setFormData(prevFormData => ({
                    ...prevFormData,
                    Qualification: prevFormData.Qualification.filter((item, i) => i !== index)
                }));
            } else {
                setQualificationRows(prevRows => prevRows.filter((row, i) => i !== index));
                setFormData(prevFormData => ({
                    ...prevFormData,
                    Qualification: prevFormData.Qualification.filter((item, i) => i !== index)
                }));
            }


        } else if (type === 'language') {
            // setLanguageRows(prevRows => prevRows.filter((row, i) => i !== index));

            if (id !== null) {
                setLangDetails(prevRows => prevRows.filter((row, i) => i !== index));
                setLanguageRows(prevRows => prevRows.filter((row, i) => i !== index));
                setFormData(prevFormData => ({
                    ...prevFormData,
                    Language: prevFormData.Language.filter((item, i) => i !== index)
                }));
            } else {
                setLanguageRows(prevRows => prevRows.filter((row, i) => i !== index));
                setFormData(prevFormData => ({
                    ...prevFormData,
                    Language: prevFormData.Language.filter((item, i) => i !== index)
                }));
            }


        }
    };

    const EmailValidate = () => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!pattern.test(formData.Master.Mail_id)) {
            setEmailError(true)
        } else {
            setEmailError(false);
        }


    }



    const handleSubmit = async (e) => {
        e.preventDefault();


        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();

        const ApplicationNo = `EOD${day}${month}${year}${hours}${minutes}${seconds}`;

        setApplicationNo(ApplicationNo);

        formData.Master.Application_Number = ApplicationNo


        if (id === null) {

            // Email validation
            if (formData.Master.Mail_id === '' || emailError) {

                /* toast.error('Please enter a valid email address.', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                }); */
                return;
            }

            // Phone number validation
            const phoneNumberPattern = /^\d{10}$/;

            if (!phoneNumberPattern.test(formData.Master.Phone_Number)) {

                /* toast.error('Please enter a valid 10-digit phone number', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                }); */
                return;
            }

            // Mandatory field validation
            const mandatoryFields = [
                'Full_Name',
                'Father_Name',
                'Date_of_Birth',
                'Gender',
                'Permanent_Address'
            ];

            for (const field of mandatoryFields) {

                if (!formData.Master[field]) {

                    /* toast.error(`Please fill in the ${field.replace('_', ' ')}`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    }); */
                    return;
                }
            }

;

            try {
                const responseCheckPhoneNumber = await axios.get(
                    process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/checkPhoneNumber',
                    {
                        params: {
                            PhoneNumber: formData.Master.Phone_Number,
                        }
                    }
                );

                console.log("Response from server:", responseCheckPhoneNumber.data);

                if (responseCheckPhoneNumber.data.error) {
                    /* toast.error(responseCheckPhoneNumber.data.error, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    }); */
                } else {

                    if (isFileselected) {
                        try {
                            // Send the file to the server using FormData
                            const response = await axios.post(
                                process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/insertFileData',
                                selectedFile,
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data', // Important for file uploads
                                    },
                                }
                            );

                            debugger;
                            const fileName = response.data;

                            formData.Master.resume = fileName; // Assign the fileName to formData.Master.resume


                            // If the phone number is unique, proceed with inserting the form data
                            const responseInsertFormData = await axios.post(
                                process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/insertFormData',
                                {
                                    FormData: formData,
                                }
                            );


                            setIsSaved(true);

                            /* toast.success(responseInsertFormData.data.message, {
                                position: "top-center",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            }); */

                        } catch (error) {
                            console.error(error);
                        }
                    } else {
                        try {

                            // If the phone number is unique, proceed with inserting the form data
                            const responseInsertFormData = await axios.post(
                                process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/insertFormData',
                                {
                                    FormData: formData,
                                }
                            );


                            setIsSaved(true);

                            /*  toast.success(responseInsertFormData.data.message, {
                                 position: "top-center",
                                 autoClose: 5000,
                                 hideProgressBar: false,
                                 closeOnClick: true,
                                 pauseOnHover: true,
                                 draggable: true,
                                 progress: undefined,
                                 theme: "dark",
                             }); */

                        } catch (error) {
                            console.error(error);
                        }
                    }

                }
            } catch (error) {
                // Handle other errors here
                console.error(error);
            }

        } else {
            const updateFormData = {
                Master: retrievedData,
                Qualification: retrievedQualification,
                Language: langDetails,
                Skills: skillDetails
            }

            try {

                if (isFileselected) {
                    const response = await axios.post(
                        process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/insertFileData',
                        selectedFile,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data', // Important for file uploads
                            },
                        }
                    );


                    const fileName = response.data;

                    updateFormData.Master.resume = fileName;

                    const responseUpdateData = await axios.post(process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/UpdateFormData', {
                        FormData: updateFormData
                    });

                    /*  toast.success(responseUpdateData.data.message, {
                         position: "top-center",
                         autoClose: 5000,
                         hideProgressBar: false,
                         closeOnClick: true,
                         pauseOnHover: true,
                         draggable: true,
                         progress: undefined,
                         theme: "dark",
                     }); */
                    setIsSaved(true);
                } else {
                    const responseUpdateData = await axios.post(process.env.NEXT_PUBLIC_REACT_APP_API_URL + 'api/UpdateFormData', {
                        FormData: updateFormData
                    });

                    /* toast.success(responseUpdateData.data.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    }); */
                    setIsSaved(true);
                }



            } catch (error) {
                /*  toast.error('Error occurred while sending data.', {
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
        }


        // If all validations pass, you can proceed with form submission
        console.log('formData', formData, retrievedData, retrievedQualification, langDetails, skillDetails);


    };


    // Function to determine device type
    function getDeviceType() {
        /* const width = window.innerWidth;
        if (width < 768) {
            return 'col-md-6';
        } else if (width >= 768 && width < 992) {
            return 'col-md-4';
        } else {
            return 'col-md-2';
        } */
    }

    useEffect(() => {

        const handleResize = () => {
            /* if (window.innerWidth <= 578) {
                setFontSize('small');
            } else {
                setFontSize('medium');
            } */
        };

        // Initial call to set font size based on initial window width
        handleResize();



        loadFields();
        loadRelationDetails();

        if (id !== null) {
            Qualification_details();
            language_details();
            loadSkillsDetails();
            loadEditData();

        } else {
            console.log('add field')
        }

        // Call the function when the component is initially mounted
        //const params = new URLSearchParams(window.location.search);
        /* const routeParamsId = params.get('Id');
        if (routeParamsId) {
            setUrlId(routeParamsId);
        } */
        loadSkillsMaster();

    }, [id]);

    /* useEffect(() => {
        function handleResize() {
            setDeviceType(getDeviceType());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); */

    const mysqlToHtmlInputType = {
        INT: 'number',
        TINYINT: 'checkbox',
        SMALLINT: 'number',
        MEDIUMINT: 'number',
        BIGINT: 'number',
        DECIMAL: 'number',
        FLOAT: 'number',
        DOUBLE: 'number',
        DATE: 'date',
        TIME: 'time',
        DATETIME: 'datetime-local',
        TIMESTAMP: 'datetime-local',
        YEAR: 'number',
        CHAR: 'text',
        VARCHAR: 'text',
        TINYTEXT: 'text',
        TEXT: 'text',
        MEDIUMTEXT: 'text',
        LONGTEXT: 'text',
        ENUM: 'select',
        SET: 'select',
        TINYBLOB: 'file',
        BLOB: 'file',
        MEDIUMBLOB: 'file',
        LONGBLOB: 'file',
        BOOLEAN: 'checkbox',
    };

    const styles = {
        overflowX: 'auto',

        // Other styles here...
    };

    return (
        <Container maxWidth="lg">

            {/* Header with logo and text */}
            <div className="text-center mb-4">
                {/* <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: '200px' }} /> */} {/* Adjust the width as needed */}
                {
                    !isSaved && (
                        <h3>Candidate Information</h3>
                    )
                }
            </div>
            {!isSaved ? (
                <form onSubmit={handleSubmit}>
                    {fields.map((item, index) => (
                        <div key={index} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', padding: '10px' }}>
                            {item.column_name === 'resume' ? null : item.column_name.endsWith('_E') && id === null ? null : item.column_name === 'Application_Number' && id === null ? null : (
                                <InputLabel style={{ fontWeight: 'bold', fontSize: fontSize, marginRight: '10px', flex: '1' }}>
                                    {item.column_name.endsWith('_E') ? item.column_name.replace(/_E$/, '').toUpperCase().split('_').join(' ') : item.column_name.toUpperCase().split('_').join(' ')}
                                </InputLabel>
                            )}

                            {item.column_name === 'resume' ? null : item.column_name.endsWith('_E') && id === null ? null : item.column_name === 'Application_Number' && id === null ? null : relationshipOptionsList.some((opt) => opt.column === item.column_name) ? (
                                <FormControl style={{ flex: '2', marginLeft: 10 }}>
                                    <InputLabel>{'Select ' + item.column_name.replace(/_E$/, '').split('_').join(' ')}</InputLabel>
                                    <Select

                                        label={'Select ' + item.column_name.replace(/_E$/, '').split('_').join(' ')}
                                        value={retrievedData[item.column_name]}
                                        onChange={(e) => handleInputChange(e, item.column_name)}

                                    >
                                        <MenuItem value="">{'Select ' + item.column_name.replace(/_E$/, '').split('_').join(' ')}</MenuItem>
                                        {(relationshipOptionsList.find((opt) => opt.column === item.column_name)?.options ?? []).map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.text}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                mysqlToHtmlInputType[item.data_type.toUpperCase()] === 'checkbox' ? (
                                    <FormControlLabel
                                        control={<Checkbox checked={retrievedData[item.column_name]} onChange={(e) => handleInputChange(e, item.column_name, 'checkbox')} />}
                                        label={`Check ${item.column_name}`}
                                        style={{ flex: '2' }}
                                    />
                                ) : (
                                    <TextField
                                        label={item.column_name}
                                        type={mysqlToHtmlInputType[item.data_type.toUpperCase()] || 'text'}
                                        value={mysqlToHtmlInputType[item.data_type] === 'date' ? formatDate(retrievedData[item.column_name]) : retrievedData[item.column_name]}
                                        onChange={(e) => handleInputChange(e, item.column_name)}
                                        placeholder={`Enter ${item.column_name.split('_').join(' ')}`}
                                        style={{ flex: '2' }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )
                            )}
                        </div>


                    ))}


                    <Typography variant='h5' style={{ paddingTop: '20px' }}>Qualification</Typography>
                    <Grid container spacing={2} className="form-group" style={{ overflowX: 'auto' }}>
                        <TableContainer>
                            <Table id="tblQualification">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Qualification</TableCell>
                                        <TableCell>Institute</TableCell>
                                        <TableCell>Percentage</TableCell>
                                        <TableCell>Year Of Passing</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {qualificationRows.map((row, index) => {
                                        const qualificationData = retrievedQualification[index] || {};

                                        
return (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {row.qualification === 'Others' ? (
                                                        <TextField
                                                            type="text"
                                                            placeholder={"Others"}
                                                            style={{ textAlign: 'center' }}
                                                            onChange={(e) => handleQualificationChange(e, 'Qualification', index)}
                                                            value={qualificationData.Qualification}
                                                        />
                                                    ) : (
                                                        <span>{row.qualification}</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="text"
                                                        placeholder="Institution"
                                                        onChange={(e) => handleQualificationChange(e, 'Institution', index)}
                                                        value={id === null ? null : qualificationData.Institution}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="text"
                                                        placeholder="Percentage"
                                                        onChange={(e) => handleQualificationChange(e, 'Percentage_of_Marks', index)}
                                                        value={id === null ? null : qualificationData.Percentage_of_Marks}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="text"
                                                        placeholder="Year of passing"
                                                        onChange={(e) => handleQualificationChange(e, 'Year_of_passing', index)}
                                                        value={id === null ? null : qualificationData.Year_of_passing}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {index >= 2 && (
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() => deleteRow(index, 'qualification')}
                                                        >
                                                            <i class="ri-delete-bin-2-fill"></i>
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div style={{ width: '100%', paddingTop: '20px' }}>
                            <div style={{ float: 'right' }}>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={addQualificationRow}
                                    style={{ width: '100%' }}
                                >
                                    + Add More Qualification
                                </Button>
                            </div>
                        </div>
                    </Grid>
                    {/* Language Table Section */}
                    <Grid container spacing={2} className="form-group" style={{ paddingTop: '20px' }}>

                        <Typography variant='h5'>Language</Typography>
                        <TableContainer>
                            <Table id="tblLanguage">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Language</TableCell>
                                        <TableCell>Read</TableCell>
                                        <TableCell>Write</TableCell>
                                        <TableCell>Speak</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>

                                {id === null ? (
                                    <TableBody>
                                        {languageRows.map((row, index) => {
                                            const languageData = langDetails[index] || {};

                                            
return (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {row.language === 'Others' ? (
                                                            <TextField
                                                                type="text"
                                                                placeholder="Others"
                                                                style={{ textAlign: 'center' }}
                                                                onChange={(e) => handleLanguageChange(e, 'Language', index)}
                                                                value={id === null ? null : languageData.language}
                                                            />
                                                        ) : (
                                                            <span>{row.language}</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            defaultChecked={
                                                                id === null
                                                                    ? false
                                                                    : languageData && languageData.lang_read === 1
                                                            }
                                                            onChange={(e) => handleLanguageCheckboxChange(e, 'lang_read', index)}
                                                        />



                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            defaultChecked={id === null ? false : languageData && languageData.lang_write === 1}
                                                            onChange={(e) => handleLanguageCheckboxChange(e, 'lang_write', index)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            onChange={(e) => handleLanguageCheckboxChange(e, 'lang_speak', index)}

                                                            //checked={id === null ? null : languageData && languageData.lang_speak === 1}
                                                            defaultChecked={id === null ? false : languageData && languageData.lang_speak === 1}

                                                        //defaultChecked={id === null ? false : skillDetails.some(item => item.skill === row.skills && item.is_active === "1")}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {index >= 2 && (
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={() => deleteRow(index, 'language')}
                                                            >
                                                                <i class="ri-delete-bin-2-fill"></i>
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                ) : (
                                    <TableBody>
                                        {languageRows.map((row, index) => {
                                            const languageData = langDetails[index] || {};

                                            
return (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {row.language === 'Others' ? (
                                                            <TextField
                                                                type="text"
                                                                placeholder="Others"
                                                                style={{ textAlign: 'center' }}
                                                                onChange={(e) => handleLanguageChange(e, 'Language', index)}
                                                                value={id === null ? null : languageData.language}
                                                            />
                                                        ) : (
                                                            <span>{row.language}</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={
                                                                id === null
                                                                    ? false
                                                                    : languageData && languageData.lang_read === 1
                                                            }
                                                            onChange={(e) => handleLanguageCheckboxChange(e, 'lang_read', index)}
                                                        />



                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={id === null ? false : languageData && languageData.lang_write === 1}
                                                            onChange={(e) => handleLanguageCheckboxChange(e, 'lang_write', index)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            onChange={(e) => handleLanguageCheckboxChange(e, 'lang_speak', index)}

                                                            //checked={id === null ? null : languageData && languageData.lang_speak === 1}
                                                            checked={id === null ? false : languageData && languageData.lang_speak === 1}

                                                        //defaultChecked={id === null ? false : skillDetails.some(item => item.skill === row.skills && item.is_active === "1")}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {index >= 2 && (
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={() => deleteRow(index, 'language')}
                                                            >
                                                                <i class="ri-delete-bin-2-fill"></i>
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                )}

                            </Table>
                        </TableContainer>
                        <div style={{ width: '100%', paddingTop: '20px' }}>
                            <div style={{ float: 'right' }}>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={addLanguageRow}
                                    style={{ width: '100%' }}
                                >
                                    + Add More Language
                                </Button>
                            </div>
                        </div>
                    </Grid>

                    {/* Skills Section */}
                    <Grid container spacing={2} className="form-group mt-3" style={{ paddingTop: '20px' }}>
                        <Typography variant="h5">Skills</Typography>
                        <div className="row col-md-12" style={{ padding: '20px', textAlign: 'start' }}>
                            <FormControl component="fieldset">
                                <FormGroup row>
                                    {/* Map through skillsRows to render dynamic Skills checkboxes in 4 columns */}
                                    {skillsRows.map((row, index) => {
                                        const skillData = skillDetails[index] || {};

                                        return (
                                            <>
                                                {id === null ? (
                                                    <FormControlLabel
                                                        key={index}
                                                        control={
                                                            <Checkbox
                                                                value={row.skills}
                                                                id={`${row.skills.toLowerCase()}Checkbox`}

                                                                //checked={id === null ? false : skillDetails.some(item => item.skill === row.skills && item.is_active === "1")}
                                                                onChange={(e) => handleCheckboxChange(e, 'Skills', row.skills)}
                                                                name={row.skills.toLowerCase()}
                                                                color="primary"
                                                            />
                                                        }
                                                        label={row.skills}
                                                    />
                                                ) : (
                                                    <FormControlLabel
                                                        key={index}
                                                        control={
                                                            <Checkbox
                                                                value={row.skills}
                                                                id={`${row.skills.toLowerCase()}Checkbox`}
                                                                checked={id === null ? false : skillDetails.some(item => item.skill === row.skills && item.is_active === "1")}
                                                                onChange={(e) => handleCheckboxChange(e, 'Skills', row.skills)}
                                                                name={row.skills.toLowerCase()}
                                                                color="primary"
                                                            />
                                                        }
                                                        label={row.skills}
                                                    />
                                                )}
                                            </>

                                        );

                                        /* return (
                                            <div key={index} className={deviceType}>
                                        <div className="form-check">
                                            <label
                                                className="form-check-label"
                                                htmlFor={`${row.skills.toLowerCase()}Checkbox`}
                                            //style={{ color: '#343A40' }}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={row.skills}
                                                    id={`${row.skills.toLowerCase()}Checkbox`}
                                                    checked={id === null ? null : skillDetails.some(item => item.skill === row.skills && item.is_active === "1")}
                                                    onChange={(e) => handleCheckboxChange(e, 'Skills', row.skills)}
                                                />

                                                {row.skills}
                                            </label>
                                        </div>
                                    </div>
                                    ); */
                                    })}
                                </FormGroup>
                            </FormControl>
                        </div>
                    </Grid>

                    <Grid container spacing={2} style={{ paddingTop: '20px' }}>
                        <Grid item xs={12} md={12}>
                            <Typography variant='h5' style={{ textAlign: 'center' }}>Resume</Typography>
                        </Grid>

                        {id !== null && (
                            <Grid item xs={12} md={id !== null ? 6 : 12} style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant='h6' style={{ fontWeight: 'bold', paddingBottom: '10px' }}>Existing Resume</Typography>
                                <Button
                                    style={{
                                        color: '#6FD520',
                                        fontWeight: 600,
                                        width: '90%',
                                        backgroundColor: 'rgb(111 213 32 / 15%)',
                                        borderRadius: '5px',
                                        lineHeight: '22px',
                                        border: '1px #6FD520 solid', // Border style,

                                    }}
                                    onClick={retrievedData.resume === null ? null : () => openInNewTab(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}upload/${retrievedData.resume}`)}
                                >
                                    {retrievedData.resume === null || retrievedData.resume === 'null' ? 'Not Selected' : retrievedData.resume}
                                </Button>



                            </Grid>
                        )}

                        <Grid item xs={12} md={id !== null ? 6 : 12} style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {id !== null && (
                                <Typography variant='h6' style={{ fontWeight: 'bold', paddingBottom: '10px' }}>New Resume</Typography>
                            )}
                            {/* <Form.Group controlId="formFile" className="mb-3">
                                <Form.Control type="file" onChange={handleFileChange} />
                            </Form.Group> */}
                            <Input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                multiple
                                type="file"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="raised-button-file">
                                <Button variant="contained" component="span">
                                    <i class="ri-upload-cloud-2-fill"></i> Upload
                                </Button>
                            </label>
                            {selectedFile && (
                                <Typography variant="body1" component="p">
                                    Selected File: {selectedFileName}
                                </Typography>
                            )}



                        </Grid>


                    </Grid>

                    {id !== null && (
                        <Button onClick={generatePDF}>Export PDF</Button>
                    )}

                    {/* Submit Button */}
                    <div className="form-group mt-3"><Button type="submit" variant='contained' style={{ width: '100%', height: '3rem' }}>{id === null ? Submit : Update}</Button> </div>


                </form>
            ) : <div style={{ textAlign: 'center', color: 'green', fontSize: '1.5rem' }}>
                <p>Your application "{applicationNo}" has been successfully submitted.</p>
                <p>Our team will review it and contact you shortly.</p>
                <p style={{ marginTop: '10px' }}>Thank you for your interest.</p>
            </div>}



        </Container>

    );
};


export default FormComponent;