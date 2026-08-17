import {
    TextField,
    Paper,
    List,
    ListItemButton,
    ListItemText,
    ClickAwayListener,
    Box
} from "@mui/material";
import { useState } from "react";
import { search } from '../../endpoints/players';

export default function SearchSelect(props) {
    const [keyword, setKeyword] = useState("");
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);

    const searchItems = async (value) => {
        let options = [];

        const response = await search(value);
        const data = response.data.data;
        options = data.items;

        return options;
    }

    const handleChange = async (event) => {
        event.preventDefault();

        const value = event.target.value;
        if (value.length >= 2) {
            setOptions(await searchItems(value));
            setOpen(true);
        } else {
            setOpen(false);
            setOptions([]);
        }
        setKeyword(value);
    };

    const handleSelect = (event, item) => {
        props.onSelect && props.onSelect(event, item);
        setOpen(false);
        setKeyword('');
    };

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box sx={{ position: "relative", width: 300, ...props.sx }}>
                <TextField
                    fullWidth
                    autoComplete="off"
                    label="Search"
                    value={keyword}
                    onChange={handleChange}
                    color="warn"
                />

                {open && options.length > 0 && (
                    <Paper
                        elevation={4}
                        sx={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            mt: 0.5,
                            zIndex: 1,
                            maxHeight: 250,
<<<<<<< HEAD
                            overflow: "auto",
                            boxShadow: "0 4px 10px 0 rgb(0, 0, 0);",
=======
                            overflow: "auto"
>>>>>>> ab6bd8ad9a31d973386746d49fdb0b087681dffa
                        }}
                    >
                        <List dense>
                            {options.map((item) => (
                                <ListItemButton
                                    key={item.id}
                                    onClick={(event) => handleSelect(event, item)}
                                >
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
}