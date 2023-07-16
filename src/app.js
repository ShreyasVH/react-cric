import router from "./router";
import { RouterProvider } from "react-router-dom";
import AppBar from './components/appBar';

export default function App() {
    return (
        <>
            <AppBar />
            <div style={{padding: '2%'}}>
                <RouterProvider router={router} />
            </div>
        </>
    );
}