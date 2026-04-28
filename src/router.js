import { createBrowserRouter } from "react-router-dom";
import Home from "./containers/home";
import TourDetails from './containers/tourDetails';
import SeriesDetails from './containers/seriesDetails';
import MatchDetails from './containers/matches/details';
import MergePlayers from './containers/players/merge';
import PlayerStats from './containers/players/stats';
import PlayerDetails from './containers/players/details';
import RootLayout from './rootLayout';

export default createBrowserRouter([
     {
       path: "/",
       element: <RootLayout />,
         children: [
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
             },
             {
                 path: "/players/merge",
                 element: <MergePlayers />
             },
             {
                 path: "/players/stats",
                 element: <PlayerStats />
             },
             {
                 path: "/players/details",
                 element: <PlayerDetails />
             },
             {
                 index: true,
                 element: <Home />
             }
     ]
    }
]);