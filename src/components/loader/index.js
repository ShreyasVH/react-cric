import { CircularProgress, Dialog } from '@mui/material';
import { useState } from "react";

export default function Loader () {
    const [ visible, setVisible ] = useState(false);

    window.addEventListener('show-loader', function(event) {
        setVisible(true);
    });

    window.addEventListener('hide-loader', function(event) {
        setVisible(false);
    });

    return (
        <>
            {
                visible && <Dialog open={true} PaperProps={{sx: {backgroundColor: 'transparent', boxShadow: 'none'}}}>
                    <CircularProgress />
                </Dialog>
            }
        </>
    );
}