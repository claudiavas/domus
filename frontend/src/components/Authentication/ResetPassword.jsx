import React, { useState, useContext, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert } from '@mui/material';
import { resetPassword } from '../apiService/apiService';
import { AuthContext } from '../Contexts/AuthContext';
import { login } from '../apiService/apiService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ResetPassword = ({ open, onClose, userId, email }) => {

  const { t } = useTranslation('auth');

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const handleLogin = async (newPwd, email) => {
    setIsLoading(true);
    try {
      const response = await login({
        email: email,
        password: newPwd
      });
      const token = response.token;
      window.localStorage.setItem("token", token);
      navigate("/MainView");
    } catch (error) {
      setErrorMessage(error);
      setErrorSnackbarOpen(true);
      setTimeout(() => {
        setErrorMessage("");
        setErrorSnackbarOpen(false);
        setIsLoading(false);
      }, 5000);
    }
    setIsLoggedIn(true);
  };


  const handleUpdate = async (userId, newPwd) => {
    try {
      const response = await resetPassword(userId, { password: newPwd });
      setSuccessMessage(response.message || t('passwordUpdated'));
      setSuccessSnackbarOpen(true);
      alert(t('passwordUpdated'));
      if (!isLoggedIn) {
        handleLogin(newPwd, email);
      }
      // onClose();

    } catch (error) {
      console.error('Error updating the password:', error);
      alert(t('passwordUpdateError'));
      setErrorMessage(t('passwordUpdateError'));
      setErrorSnackbarOpen(true);
    }
  };

  const handleSubmit = async (event) => {
 
    if (!newPwd) {
      setErrorMessage(t('passwordRequired'));
      setErrorSnackbarOpen(true);
      return;
    }

    if (!confirmPwd) {
      setErrorMessage(t('confirmRequired'));
      setErrorSnackbarOpen(true);
      return;
    }

    if (newPwd !== confirmPwd) {
      setErrorMessage(t('passwordsDontMatch'));
      setErrorSnackbarOpen(true);
      return;
    }

    handleUpdate(userId, newPwd)
    onClose();
  };

  const handleClose = () => {
    setNewPwd('');
    setConfirmPwd('');
    setErrorMessage('');
    setErrorSnackbarOpen(false);
    setSuccessMessage('');
    setSuccessSnackbarOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('changePwd')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('newPwd')}
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t('confirmPwd')}
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};
