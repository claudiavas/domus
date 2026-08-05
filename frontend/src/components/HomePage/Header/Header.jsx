import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Avatar, Box, Divider, ListItemIcon, Tooltip, Container } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../../Contexts/AuthContext';
import HomeIcon from '@mui/icons-material/Home';


export const Header = ({component}) => {

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

  // Comparar en minúsculas: la ruta registrada es /MainView
  const isMainView = ['/mainview', '/'].includes(location.pathname.toLowerCase());

  // Lógica para cerrar sesión...

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate("/") // el listado es público: al salir se sigue navegando
  };




  return (
    <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {isMainView ? (
        <>
          {/* En el menú: solo el icono y las letras en blanco a la derecha */}
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
              // En móvil, centrado real respecto a la barra completa
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
          <HomeIcon onClick={() => (navigate("/mainview"))} />

          <Typography variant="h5" noWrap component="div">
            {component}
          </Typography>
        </>
      )}
      <React.Fragment>
        <Box >
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
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

          {isLoggedIn ? (
            <div>
              <MenuItem onClick={() => (
                navigate("/userprofile")
              )}>
                <Avatar sx={{ width: 32, height: 32 }} src={profile.profilePicture} /> Mi perfil
              </MenuItem>
              <Divider />
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Cerrar sesión
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
                <Avatar sx={{ width: 32, height: 32 }} /> Registrarse
              </MenuItem>
            </div>
          )}
        </Menu>
      </React.Fragment>
    </Container>
  )
}