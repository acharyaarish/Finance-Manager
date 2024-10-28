// src/themes.js

import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    background: {
      default: '#ffffff',
      paper: '#f4f6f8',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff4081',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
  },
});
