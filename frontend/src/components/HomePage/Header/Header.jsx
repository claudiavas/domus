import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Avatar, Box, Divider, ListItemIcon, Tooltip, Container } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../../Contexts/AuthContext';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AddIcon from '@mui/icons-material/Add';
import LanguageIcon from '@mui/icons-material/Language';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ColorModeContext } from '../../../theme';
import { useTranslation } from 'react-i18next';


export const Header = ({component}) => {

  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const { t, i18n } = useTranslation('ui');

  /** Switches between Spanish and English and remembers the choice. */
  const toggleLanguage = () => {
    const next = i18n.language?.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const { profile } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Compare lower-cased: the registered route is /MainView
  const isMainView = ['/mainview', '/'].includes(location.pathname.toLowerCase());


  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate("/") // browsing stays public after logout
  };




  return (
    <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {isMainView ? (
        <>
          {/* Menu variant: white icon plus wordmark */}
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
              // Centred against the full bar width on mobile
              position: { xs: 'absolute', sm: 'static' },
              left: { xs: '50%', sm: 'auto' },
              transform: { xs: 'translateX(-50%)', sm: 'none' },
            }}
            onClick={() => navigate('/mainview')}
          >
            <Box component="img" src="/logo-domus-blanco.png" alt="" sx={{ height: 34 }} />
            <Typography variant="h6" noWrap component="div" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1 }}>
              DOMUS
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" aria-label="Volver" onClick={() => navigate(-1)} edge="start">
              <ArrowBackIcon />
            </IconButton>
            <HomeIcon sx={{ cursor: 'pointer' }} onClick={() => (navigate("/mainview"))} />
          </Box>

          <Typography variant="h6" noWrap component="div" sx={{ fontSize: { xs: 16, sm: 20 } }}>
            {component}
          </Typography>
        </>
      )}
      <React.Fragment>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
          {/* Language and theme live in the bar on desktop and inside the
              account menu on mobile, where horizontal space is scarce */}
          <Tooltip title={i18n.language?.startsWith('es') ? 'English' : 'Español'}>
            <IconButton color="inherit" onClick={toggleLanguage} sx={{ fontSize: 14, fontWeight: 700, width: 40, display: { xs: 'none', sm: 'inline-flex' } }}>
              {i18n.language?.startsWith('es') ? 'EN' : 'ES'}
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === 'light' ? t('darkMode') : t('lightMode')}>
            <IconButton color="inherit" onClick={toggleColorMode} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={t('account')}>
            <IconButton
              onClick={handleClick}
              size="small"
              // Mirrors the left inset of the drawer toggle on mobile
              sx={{ ml: 2, mr: { xs: '-12px', sm: 0 } }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              {profile.profilePicture ? (
                <Avatar alt="profile picture" src={profile.profilePicture} sx={{ width: 32, height: 32 }} />
              ) : (
                <Avatar sx={{ width: 32, height: 32 }} />
              )}

            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          disableScrollLock
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >

          <MenuItem onClick={toggleLanguage} sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <ListItemIcon>
              <LanguageIcon fontSize="small" />
            </ListItemIcon>
            {i18n.language?.startsWith('es') ? 'English' : 'Español'}
          </MenuItem>
          <MenuItem onClick={toggleColorMode} sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <ListItemIcon>
              {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </ListItemIcon>
            {mode === 'light' ? t('darkMode') : t('lightMode')}
          </MenuItem>
          <Divider />
          {isLoggedIn ? (
            <div>
              <MenuItem onClick={() => (
                navigate("/userprofile")
              )}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                {t('myProfile')}
              </MenuItem>
          {/* Publishing entry mirrors the floating action button; guests are
              routed to the login first */}
          <MenuItem onClick={() => navigate(isLoggedIn ? "/addhousing" : "/login")}>
            <ListItemIcon>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            {t('publishProperty')}
          </MenuItem>
              <Divider />
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                {t('logout')}
              </MenuItem>
            </div>
          ) : (
            <div>
              <MenuItem onClick={() => navigate("/login")}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" style={{ transform: 'rotate(180deg)' }} />
                </ListItemIcon>
                Iniciar sesión
              </MenuItem>
              <MenuItem onClick={() => navigate("/register")}>
                <ListItemIcon>
                  <PersonAddIcon fontSize="small" />
                </ListItemIcon>
                {t('register')}
              </MenuItem>
          {/* Publishing entry mirrors the floating action button; guests are
              routed to the login first */}
          <MenuItem onClick={() => navigate(isLoggedIn ? "/addhousing" : "/login")}>
            <ListItemIcon>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            {t('publishProperty')}
          </MenuItem>
            </div>
          )}
        </Menu>
      </React.Fragment>
    </Container>
  )
}