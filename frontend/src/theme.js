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
    // Alerts en la gama de la marca: éxito = verde Domus,
    // warning = ámbar cálido que no choca con el teal
    success: {
      main: DOMUS_GREEN,
      dark: '#238A8E',
      light: '#62C4C8',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#E6A23C',
      dark: '#C7842A',
      light: '#F0BC6B',
      contrastText: '#ffffff',
    },
  },
});
