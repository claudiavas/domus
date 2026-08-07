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
    components: {
      // MUI already sizes the notch cut into an outlined field from the label
      // text, but it measures it in the field's own em (0.75em of the input),
      // while the floating label shrinks from its own font-size. When a
      // section resizes only one of the two the floating text ends up wider
      // than its gap and lands on the border.
      // Making both inherit ties them together: whatever font-size a section
      // sets on the field (or on any container above it) applies to label and
      // input alike, so the gap always matches the label. No section needs to
      // restate it.
      MuiInputBase: { styleOverrides: { root: { fontSize: 'inherit' } } },
      MuiInputLabel: { styleOverrides: { root: { fontSize: 'inherit' } } },
      MuiFormHelperText: { styleOverrides: { root: { fontSize: '0.75em' } } },
    },
  });
}

/** Default theme, kept for modules that import it statically. */
export const theme = buildTheme('light');
