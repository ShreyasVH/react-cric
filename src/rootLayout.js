import { Outlet } from "react-router-dom";
import AppBar from './components/appBar';
import Alert from './components/alert';
import Loader from './components/loader';

export default function RootLayout() {
    return (
        <>
            <AppBar />
            <Alert />
            <Loader />

            <div style={{ padding: "2%" }}>
                <Outlet />
            </div>
        </>
    );
}