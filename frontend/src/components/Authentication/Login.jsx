import Avatar from '@mui/material/Avatar';
import { theme as temaDomus } from '../../theme';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Copyright } from '../HomePage/Footer/Copyright';
import React, { useState, useContext } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../Contexts/AuthContext';
import { login } from '../apiService/apiService';
import { useTranslation } from 'react-i18next';

const defaultTheme = temaDomus;

export function Login() {
  const { t } = useTranslation('auth');
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    setLoading(true);

    try {
      const response = await login({
        email: email.value,
        password: password.value
      });
      const token = response.token;
      window.localStorage.setItem("token", token);
      navigate("/MainView");
    } catch (error) {
      setError(error.response.data.error.result);
      setIsError(true);
      setTimeout(() => {
        setError("");
        setIsError(false);
        setLoading(false);
      }, 5000);
    }
    setIsLoggedIn(true);
  };


  return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              minHeight: '78vh',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box component="img" src="/favicon-domus.png" alt="Domus" sx={{ m: 1, height: 56 }} />
            <Typography component="h1" variant="h5">
              {t('loginTitle')}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('email')}
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('passwordLabel')}
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <LoadingButton 
                loading={isLoading && !isError}  
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                <span>{t('signIn')}</span>
              </LoadingButton>
              {error && <p style={{ color: 'red', align: "center"}}>{error}</p>}
              <Grid container>
                <Grid item xs>
                  <Link onClick={() => navigate("/forgotpassword")} variant="body2">
                    {t('forgotPwd')}
                  </Link>
                </Grid>
                <Grid item>
                  <Link onClick={() => navigate("/register")} variant="body2">
                    {t('noAccount')}
                  </Link>
                </Grid>
              </Grid>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link onClick={() => navigate('/')} variant="body2" sx={{ cursor: 'pointer' }}>
                  {t('continueAsGuest')}
                </Link>
              </Box>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }}/>
        </Container>
      </ThemeProvider>
  );
}
