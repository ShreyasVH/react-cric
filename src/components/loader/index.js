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
                visible && <Dialog open={true} slotProps={{paper: { sx: {backgroundColor: 'transparent', boxShadow: 'none', backgroundImage: "none",}}}}>
                    <CircularProgress />
                </Dialog>
            }
        </>
    );
}