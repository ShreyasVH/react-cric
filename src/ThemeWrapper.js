import { useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ColorModeContext } from "./ThemeContext";
import { getTheme } from "./themes";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function ThemeWrapper({ children }) {
    const prefersDarkMode = useMediaQuery(
        '(prefers-color-scheme: dark)'
    );

    const [mode, setMode] = useState(prefersDarkMode ? 'dark': 'light');
    const [theme, setTheme] = useState(null);

    const toggleTheme = () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
    };

    useMemo(() => {
        setTheme(getTheme(mode))
    }, [mode]);

    return (
        <ColorModeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}