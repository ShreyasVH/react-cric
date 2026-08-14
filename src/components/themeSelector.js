import {
    FormControlLabel,
    Switch
} from "@mui/material";

import { useColorMode } from "../ThemeContext";

export default function ThemeSelector() {
    const { mode, toggleTheme } = useColorMode();

    return (
        <FormControlLabel
            label={mode === "dark" ? "Dark mode" : "Light mode"}
            control={
                <Switch
                    checked={mode === "dark"}
                    onChange={toggleTheme}
                    inputProps={{
                        "aria-label": "Toggle dark mode"
                    }}
                    color="error"
                />
            }
        />
    );
}