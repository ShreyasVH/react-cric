import {
    IconButton,
    Toolbar,
    AppBar,
    CssBaseline
} from "@mui/material";
import { Menu } from "@mui/icons-material";

export default function AppBarCustom() {
    return (
        <>
            <CssBaseline />
            <AppBar position="relative" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit">
                        <Menu />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </>
    );
}