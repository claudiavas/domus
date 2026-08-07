import React, { useEffect, useState } from 'react';
import { theme as temaDomus } from '../../theme';
import { Container, Box, Typography, Avatar, TextField, Link, Grid, Snackbar, Alert } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import { findUserByEmail } from '../apiService/apiService';
import { sendPasswordResetEmail } from '../apiService/apiService';
import { useTranslation } from 'react-i18next';

export function ForgotPassword() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  

    const sendEmail = async (email, name, userId) => {
      try {
        const body = {
          email: email,
          name: name,
          userId: userId
        };
        const response = await sendPasswordResetEmail(body);
        setSuccessSnackbarOpen(true);
        setSuccessMessage(t('emailSentOk'));
      } catch (error) {
        console.error('Error sending the password reset email:', error);
        setErrorMessage(t('emailSendError'));
      }
    };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!email) {
        setErrorMessage(t('emailRequired'));
        setErrorSnackbarOpen(true);
        return;
      }

      if (!email.includes('@') || !email.includes('.') || email.length > 320 || email.length < 6) {
        setErrorMessage(t('emailInvalid'));
        setErrorSnackbarOpen(true);
        return;
      }



      const response = await findUserByEmail(email);
        if (response && response.length > 0) {
          const user = response[0];
          const name = user.name;
          const userId = user._id;
          sendEmail(email, name, userId);
        } else {
          setErrorMessage(t('emailNotFound'));
          setErrorSnackbarOpen(true);
        }
      
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(t('emailNotFound'));
      setErrorSnackbarOpen(true);
    }
  };

  const defaultTheme = temaDomus;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
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
          <Typography align="center" component="h1" variant="h5">
            {t('forgotTitle')}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <LoadingButton
              loading={sent}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              <span>{t('sendEmail')}</span>
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link variant="body2" onClick={() => navigate('/register')}>
                  {t('wantRegister')}
                </Link>
              </Grid>
              <Grid item>
                <Link variant="body2" onClick={() => navigate('/login')}>
                  {t('backToLogin')}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
        open={errorSnackbarOpen} 
        autoHideDuration={5000} 
        onClose={() => setErrorSnackbarOpen(false)} 
        >
        <Alert 
          elevation={6} 
          variant="filled" 
          severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
        open={successSnackbarOpen} 
        autoHideDuration={5000} 
        onClose={() => setSuccessSnackbarOpen(false)} 
        >
        <Alert 
          elevation={6} 
          variant="filled"
          severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
