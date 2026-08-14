import { createTheme } from '@mui/material/styles';

const lightPalette = {
    mode: 'light',
    primary: {
        main: '#1976d2',
        contrastText: '#ffffff'
    },
    secondary: {
        main: '#ba68c8'
    },
    error: {
        main: '#d32f2f'
    },
    warning: {
        main: '#ff9800',
        contrastText: '#ffffff'
    },
    info: {
        main: '#03a9f4',
        contrastText: '#ffffff'
    },
    success: {
        main: '#4caf50',
        contrastText: '#ffffff'
    }
};

const darkPalette = {
    mode: 'dark',
    primary: {
        main: '#90caf9',
        contrastText: '#000000'
    },

    secondary: {
        main: '#ce93d8',
        contrastText: '#000000'
    },

    error: {
        main: '#f44336',
        contrastText: '#000000'
    },

    warning: {
        main: '#ffb74d',
        contrastText: '#000000'
    },

    info: {
        main: '#4fc3f7',
        contrastText: '#000000'
    },

    success: {
        main: '#66bb6a',
        contrastText: '#000000'
    },

    background: {
        default: '#121316',
        paper: '#373737'
    },

    text: {
        disabled: '#777777',
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
    },

    divider: 'rgba(255,255,255,0.12)',

    action: {
        disabled: '#777777',
        disabledBackground: '#373737',
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
        selected: 'rgba(255, 255, 255, 0.16)'
    },
};

export const getTheme = (mode) => {
    return createTheme({
        palette: ((mode === 'light') ? lightPalette : darkPalette)
    });
}