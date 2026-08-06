import { createTheme } from '@mui/material/styles';
import { createContext } from 'react';

/** Brand color taken from the Domus logo. */
export const DOMUS_GREEN = '#31AFB4';

/**
 * Context used by the header toggle to switch between light and dark mode.
 * The chosen mode is persisted in localStorage by the provider (see main.jsx).
 */
export const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'light' });

/**
 * Builds the application theme for the given mode.
 * Success alerts reuse the brand green; warnings use a warm amber that
 * pairs well with the teal palette.
 *
 * @param {'light'|'dark'} mode
 */
export function buildTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: DOMUS_GREEN,
        dark: '#238A8E',
        light: '#62C4C8',
        contrastText: '#ffffff',
      },
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
      ...(mode === 'dark' && {
        background: {
          default: '#10191a',
          paper: '#162223',
        },
      }),
    },
  });
}

/** Default theme, kept for modules that import it statically. */
export const theme = buildTheme('light');
