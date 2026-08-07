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
import React, { useState, useEffect, useContext } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from "react-router-dom";
import { ResetPassword } from './ResetPassword';
import queryString from 'query-string';
import { useParams, useLocation } from 'react-router-dom';
import { getPayload } from '../apiService/apiService';
import { useTranslation } from 'react-i18next';

const defaultTheme = temaDomus;

export function PasswordRecovery() {
  const { t } = useTranslation('auth');
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);

  const location = useLocation();
  const queryParams = queryString.parse(location.search);

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null); // Variable para almacenar el userId
  const [email, setEmail] = useState(null); // Variable para almacenar el email

  const handleResetPasswordOpen = () => {
    setOpen(true);
  };

  const handleResetPasswordClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    findUser();
  }, []);

  useEffect(() => {
  }, [userId, email]);

  const findUser = async () => {
    try {
      const mailtoken = queryParams.token;
      const payload = await getPayload(mailtoken);
      const payloaduserId = payload.data.userId;
      const payloademail = payload.data.email;
      setUserId(payloaduserId); // Guardar el userId en el estado
      setEmail(payloademail); // Guardar el email en el estado
    } catch (error) {
      console.error('The recovery link has expired', error);
      alert(t('linkExpired'));
    }
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
          <Typography sx={{ marginBottom: "50px" }} component="h1" variant="h5">
            {t('welcomeBack')}
          </Typography>
          <div style={{ marginBottom: "40px", display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="primary" variant="contained" onClick={handleResetPasswordOpen}>{t('changePwd')}</Button>
            {open && <ResetPassword open={open} onClose={handleResetPasswordClose} userId={userId} email={email}/>}
          </div>
          <Link justifyContent="center" onClick={() => navigate("/forgotpassword")} variant="body2">
                {t('regenerateEmail')}
              </Link>

        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
