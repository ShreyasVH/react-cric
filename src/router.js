import { createBrowserRouter } from "react-router-dom";
import Home from "./containers/home";

export default createBrowserRouter([
     {
       path: "/",
       element: <Home />
    },
    {
        path: "/browse",
        element: <Home />
    }
]);