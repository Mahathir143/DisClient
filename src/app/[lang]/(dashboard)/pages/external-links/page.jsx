'use client'

// ** React Imports
import { useEffect, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';


const ExternalLinks = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [link, setLink] = useState('');

    useEffect(() => {
        debugger;
        const id = searchParams.get('id');

        if (id) {

            // Use the 'id' parameter to retrieve the corresponding link from localStorage
            const storedLink = localStorage.getItem(id);

            if (storedLink) {
                localStorage.removeItem(id); // Remove the stored item once retrieved
                setLink(storedLink);
            }
        }
    }, [searchParams.get('id')]); // Add router.query to the dependency array to trigger useEffect on query changes

    return (
        <Card>
            <Box sx={{ width: '100%', height: '80vh' }}>
                {link && <iframe src={link} width="100%" height="100%" title="External Link" allowFullScreen />}
            </Box>
        </Card>
    );
};

export default ExternalLinks;
