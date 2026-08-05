import { createTheme } from '@mui/material/styles';

// Color de marca: el verde del logo de Domus
export const DOMUS_GREEN = '#31AFB4';

export const theme = createTheme({
  palette: {
    primary: {
      main: DOMUS_GREEN,
      dark: '#238A8E',   // hover / estados activos
      light: '#62C4C8',
      contrastText: '#ffffff',
    },
  },
});
