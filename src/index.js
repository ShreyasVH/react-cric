import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { ThemeProvider } from '@mui/material/styles';
import themes from './themes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={themes}>
        <App />
    </ThemeProvider>
);
