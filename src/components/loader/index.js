import {Alert, CircularProgress, Dialog} from '@mui/material';
import { useState } from "react";

export default function Loader () {
    const [ visible, setVisible ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ severity, setSeverity ] = useState('');

    window.addEventListener('show-loader', function(event) {
        setVisible(true);
    });

    window.addEventListener('hide-loader', function(event) {
        setVisible(false);
    });

    return (
        <>
            {
                visible && <Dialog open={true}>
                    <CircularProgress />
                </Dialog>
            }
        </>
    );
}