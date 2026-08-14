import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import ThemeWrapper from "./ThemeWrapper";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeWrapper>
        <App />
    </ThemeWrapper>
);
