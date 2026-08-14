import {
    IconButton,
    Toolbar,
    AppBar,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import MergeIcon from '@mui/icons-material/Merge';
import HomeIcon from '@mui/icons-material/Home';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchSelect from '../searchSelect';
import ThemeSelector from '../../components/themeSelector'

export default function AppBarCustom() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navigate = useNavigate();

    const toggleDrawer = () => setDrawerOpen(!drawerOpen)

    const closeDrawer = () => setDrawerOpen(false)

    const handlePlayerSelect = (event, item) => {
        const url = `/players/details?id=${item.id}`;
        navigate(url);
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="relative" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                        <Menu />
                    </IconButton>

                    <SearchSelect onSelect={handlePlayerSelect} sx={{ ml: 'auto' }} />

                    &nbsp;&nbsp;

                    <ThemeSelector />
                </Toolbar>
            </AppBar>

            <Drawer open={drawerOpen} onClose={closeDrawer}>
                <Toolbar />
                <List sx={{width:256}}>
                    <ListItem key="home">
                        <ListItemButton component={Link} to="/" onClick={closeDrawer}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem key="playerStats">
                        <ListItemButton component={Link} to="/players/stats" onClick={closeDrawer}>
                            <ListItemIcon>
                                <QueryStatsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Players Stats" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem key="playerMerge">
                        <ListItemButton component={Link} to="/players/merge" onClick={closeDrawer}>
                            <ListItemIcon>
                                <MergeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Players Merge" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}