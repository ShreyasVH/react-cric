import { createBrowserRouter } from "react-router-dom";
import Home from "./containers/home";
import TourDetails from './containers/tourDetails';
import SeriesDetails from './containers/seriesDetails';

export default createBrowserRouter([
     {
       path: "/",
       element: <Home />
    },
    {
        path: "/browse",
        element: <Home />
    },
    {
        path: "/tours/detail",
        element: <TourDetails />
    },
    {
        path: "/series/detail",
        element: <SeriesDetails />
    }
]);