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
import { Link } from "react-router-dom";

export default function AppBarCustom() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => setDrawerOpen(!drawerOpen)

    const closeDrawer = () => setDrawerOpen(false)

    return (
        <>
            <CssBaseline />
            <AppBar position="relative" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                        <Menu />
                    </IconButton>
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