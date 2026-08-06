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
import { Footer } from '../Footer';
import { useState, useContext, useEffect } from 'react';
import { HousingList } from './HousingList/HousingList';
import { RequestList } from './RequestList/RequestList';
import { HousingMap } from './HousingMap/HousingMap';
import { Header } from '../HomePage/Header/Header';
import { AuthContext } from '../Contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { InmueblesProvider } from '../FilterHousing/HousingContextFilter.jsx';


const drawerWidth = 330;

export function MainView(props) {

  const { t } = useTranslation('ui');
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


  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate("/login")
  };


  // Browsing is public; publishing, saving searches and the personal
  // toggles require an authenticated session
  const haySesion = Boolean(localStorage.getItem('token'));

  const handleMyHousingSwitch = () => {
    setMyHousingSwitch((prevValue) => !prevValue);
  };

  const handleMyRequestsSwitch = () => {
    setMyRequestsSwitch((prevValue) => !prevValue);
  };


  return (
    <Box sx={{ display: 'flex'}}>

      <AppBar
        position="fixed"
        // Full-width app bar layered above the drawer (standard MUI pattern)
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
            // The app bar sits on top, so the mobile drawer starts right below it
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
            // Subtract the app bar height; otherwise the panel footer
            // would fall below the visible area
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
          // minWidth 0 stops the content from forcing this flex item beyond
          // the mobile viewport; padding shrinks on small screens
          minWidth: 0,
          p: { xs: 1.5, sm: 3 },
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />


        <Box sx={{
          // Stays visible while scrolling, pinned below the app bar
          position: 'sticky',
          top: { xs: 56, sm: 64 },
          zIndex: 10,
          backgroundColor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs">
            <Tab label={t('tabs.listings')} {...a11yProps(0)} />
            <Tab label={t('tabs.map')} {...a11yProps(1)} />
            {/* Saved searches are personal, so the tab needs a session */}
            {haySesion && <Tab label={t('tabs.mySearches')} {...a11yProps(2)} />}
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <HousingList myHousingSwitch={myHousingSwitch} onToggleMias={handleMyHousingSwitch}/>

          {/* En móvil: más pequeño y por encima de la paginación fija */}
          {/* Smaller on mobile and raised above the pagination row */}
          <Box sx={{ position: 'fixed', right: { xs: '12px', sm: '20px' }, bottom: { xs: '68px', sm: '20px' }, zIndex: '9999', display: mobileOpen ? 'none' : 'block' }}>
            <Fab
              color="primary"
              onClick={() => navigate(haySesion ? "/addhousing" : "/login")}
              aria-label="add"
              sx={{ width: { xs: 44, sm: 56 }, height: { xs: 44, sm: 56 } }}
            >
              <AddIcon />
            </Fab>
          </Box>

        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <HousingMap />
        </TabPanel>
        {haySesion && <TabPanel value={tabValue} index={2}>
          <RequestList alUsarBusqueda={() => {
            setTabValue(0);
            // On mobile, open the panel so the applied filters are visible
            if (window.innerWidth < 600) setMobileOpen(true);
          }}/>
        </TabPanel>}
        <Footer />
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