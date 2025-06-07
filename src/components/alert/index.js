import { Alert } from '@mui/material';
import { useState } from "react";

export default function GlobalAlert () {
    const [ visible, setVisible ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ severity, setSeverity ] = useState('');

    window.addEventListener('show-alert', function(event) {
        setMessage(event.detail.message);
        setSeverity(event.detail.severity);
        setVisible(true);
    });

    const handleClose = () => {
        setVisible(false);
    }

    return (
        <>
            {
                visible && <Alert severity={severity} onClose={handleClose}>
                    {message}
                </Alert>}
        </>
    );
}