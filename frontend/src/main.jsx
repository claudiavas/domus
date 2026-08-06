import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { InmueblesProvider } from './components/FilterHousing/HousingContextFilter.jsx';
import "./i18n"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './index.css'

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { buildTheme, ColorModeContext } from './theme';
import { AuthProvider } from './components/Contexts/AuthContext.jsx';
import { LocationProvider } from './components/Contexts/LocationContext.jsx';
import { HousingProvider } from './components/Contexts/HousingContext.jsx';
import { ImagesProvider } from './components/Contexts/ImagesContext.jsx';

/**
 * Application root. Owns the light/dark mode preference (persisted in
 * localStorage) and wires every context provider around the router.
 */
function Root() {
  const [mode, setMode] = useState(() => localStorage.getItem('colorMode') || 'light');

  const colorMode = useMemo(() => ({
    mode,
    toggleColorMode: () => {
      setMode((prev) => {
        const next = prev === 'light' ? 'dark' : 'light';
        localStorage.setItem('colorMode', next);
        return next;
      });
    },
  }), [mode]);

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <LocationProvider>
            <HousingProvider>
              <ImagesProvider>
                <InmueblesProvider>
                  <App />
                </InmueblesProvider>
              </ImagesProvider>
            </HousingProvider>
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
