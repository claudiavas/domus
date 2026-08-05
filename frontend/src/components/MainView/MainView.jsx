import React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import { Container, ToggleButton } from '@mui/material';
import PropTypes from 'prop-types';
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography, Tabs, Tab, Fab, FormControlLabel, Switch } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Filters from './Filters/Filters';
import { useState, useContext, useEffect } from 'react';
import { HousingList } from './HousingList/HousingList';
import { RequestList } from './RequestList/RequestList';
import { Header } from '../HomePage/Header/Header';
import { AuthContext } from '../Contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { InmueblesProvider } from '../FilterHousing/HousingContextFilter.jsx';


const drawerWidth = 330;

export function MainView(props) {

  const navigate = useNavigate()
  const { profile } = useContext(AuthContext);
  const [myHousingSwitch, setMyHousingSwitch] = useState(false);
  const [myRequestsSwitch, setMyRequestsSwitch] = useState(false);

  // Responsive Drawer
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  // App bar
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const container = window !== undefined ? () => window().document.body : undefined;

  // Tabs

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };


  // TabPanel

  function a11yProps(index) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: { xs: 1, sm: 3 } }}>
            <Typography component="div">{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  // Lógica para cerrar sesión...

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate("/login")
    console.log("isLoggedIn en MainView:", isLoggedIn)
    console.log("logout ejecutándose")
  };


  // El listado es público: sin token se puede navegar, pero las acciones
  // (publicar, guardar requerimientos, ver solo lo mío) requieren sesión
  const haySesion = Boolean(localStorage.getItem('token'));

// Lógica para filtrar las viviendas del usuario logueado
  const handleMyHousingSwitch = () => {
    setMyHousingSwitch((prevValue) => !prevValue);
    // console.log("myHousingSwitch:", myHousingSwitch)
  };

  const handleMyRequestsSwitch = () => {
    setMyRequestsSwitch((prevValue) => !prevValue);
  };


  return (
    <Box sx={{ display: 'flex'}}>

      <AppBar
        position="fixed"
        // A ancho completo, por encima del drawer (patrón estándar de MUI)
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <ManageSearchIcon style={{ fontSize: '30px' }} />
          </IconButton>
         <Header/>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            // El AppBar va por encima: el drawer móvil empieza justo debajo
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              mt: '56px',
              height: 'calc(100% - 56px)',
            },
          }}
        >
          <Filters onClose={handleDrawerToggle} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block'  },
            // Restar el alto del AppBar: si no, el pie del panel (botón de
            // guardar búsqueda) queda por debajo del área visible
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, marginTop: "60px", height: 'calc(100% - 60px)' },
          }}
          open
        >
          <Filters />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // minWidth 0 evita que el contenido fuerce al flex-item a desbordar
          // el viewport en móvil; el padding se reduce en pantallas pequeñas
          minWidth: 0,
          p: { xs: 1, sm: 3 },
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />


        <Box sx={{
          // Siempre visible al hacer scroll, pegada bajo el AppBar
          position: 'sticky',
          top: { xs: 56, sm: 64 },
          zIndex: 10,
          backgroundColor: '#fff',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs">
            <Tab label="Inmuebles" {...a11yProps(0)} />
            <Tab label="Mis búsquedas" {...a11yProps(1)} />
          </Tabs>
          {/* El switch va a la derecha, a la altura de los tabs */}
          {tabValue === 0 && haySesion && (
            <FormControlLabel
              sx={{ mr: 0 }}
              control={<Switch checked={myHousingSwitch} onChange={handleMyHousingSwitch} color="primary" />}
              label="Mostrar sólo mis propiedades"
            />
          )}
          {tabValue === 1 && haySesion && (
            <FormControlLabel
              sx={{ mr: 0 }}
              control={<Switch checked={myRequestsSwitch} onChange={handleMyRequestsSwitch} color="primary" />}
              label="Mostrar sólo mis búsquedas"
            />
          )}
        </Box>
        <TabPanel value={tabValue} index={0}>
          <HousingList myHousingSwitch={myHousingSwitch}/>

          <Box sx={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: '9999' }}>
            <Fab
              color="primary"
              onClick={() => navigate(haySesion ? "/addhousing" : "/login")}
              aria-label="add"
            >
              <AddIcon />
            </Fab>
          </Box>

        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <RequestList myRequestsSwitch={myRequestsSwitch}/>
        </TabPanel>
      </Box>
    </Box>
  );
}

MainView.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
}