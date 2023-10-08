import { createBrowserRouter } from "react-router-dom";
import Home from "./containers/home";
import TourDetails from './containers/tourDetails';
import SeriesDetails from './containers/seriesDetails';
import MatchDetails from './containers/matches/details';

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
    },
    {
        path: "/matches/detail",
        element: <MatchDetails />
    }
]);