import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Button, Box, Typography} from "@mui/material";
import PageNavigator from './PageNavigator';
import { Home } from '@mui/icons-material';
import { ComponentJSON } from './PageRouter';

interface ErrorPageProps {
    papers: Array<ComponentJSON>;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ papers }) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/");
    };

    return (
        <Box sx={{ marginLeft: "5px" }}>
            <PageNavigator papers={papers} code={papers[0].papers[0].code} />
            <Box textAlign="center" mt={5}>
                <Typography variant="h3" color="error" gutterBottom>
                    Oops! Something went wrong.
                </Typography>
                <Typography variant="h6" gutterBottom>
                    The page you are looking for does not exist or an error occurred.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGoBack} style={{ marginTop: '20px' }} startIcon={<Home />}>
                    Go Back
                </Button>
            </Box>
        </Box>
    );
};



export default ErrorPage;