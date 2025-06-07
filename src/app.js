import router from "./router";
import { RouterProvider } from "react-router-dom";
import AppBar from './components/appBar';
import Alert from './components/alert';
import Loader from './components/loader';

export default function App() {
    return (
        <>
            <AppBar />
            <Alert />
            <Loader />
            <div style={{padding: '2%'}}>
                <RouterProvider router={router} />
            </div>
        </>
    );
}