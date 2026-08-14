import router from "./router";
import { RouterProvider } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

export default function App() {
    const theme = useTheme();

    return (
        <div data-theme={theme.palette.mode}>
            <RouterProvider router={router} />
        </div>
    );
}