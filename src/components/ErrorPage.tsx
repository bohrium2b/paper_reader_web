import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>404 - Page Not Found</h1>
            <p style={styles.message}>Sorry, the page you are looking for does not exist.</p>
            <button style={styles.button} onClick={handleGoBack}>Go Back</button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center' as 'center',
        backgroundColor: '#f8f8f8',
    },
    header: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    message: {
        fontSize: '1.5rem',
        marginBottom: '2rem',
    },
    button: {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        cursor: 'pointer',
    },
};

export default ErrorPage;