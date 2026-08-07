import React, { useState, useContext, useEffect } from 'react';
import { Box, Snackbar, Grid, Paper, TextField, Button, IconButton, Avatar, FormControl, InputLabel, Select, MenuItem, Typography, Checkbox, Fab } from '@mui/material';
import { Container } from '@mui/material';
import axios from 'axios';
import { Images } from '../Images/Images';
import { ImagesContext } from '../../Contexts/ImagesContext';
import { AuthContext } from '../../Contexts/AuthContext';
import { Dining } from '@mui/icons-material';
import { ResetPassword } from '../../Authentication/ResetPassword';
import { updateUser } from '../../apiService/apiService';
import { Header } from '../../HomePage/Header/Header';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { getInitials } from '../../../utils/initials';

export const EditUserProfile = () => {

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { imageUrls } = useContext(ImagesContext);
  const { profile } = useContext(AuthContext);
  const [subscription, setSubscription] = useState(true);

  const [open, setOpen] = useState(false);

  const handleResetPasswordOpen = () => {
    setOpen(true);
  };


  const handleResetPasswordClose = () => {
    setOpen(false);
  };

  const snackbarStyle = {
    backgroundColor: '#31AFB4', // verde de marca
    color: '#fff',
  };


  const handleCheckboxChange = (event) => {
    setSubscription(event.target.checked);
  };

  const [formData, setFormData] = useState({

    DocumentType: 'DNI',
    documentNumber: profile.documentNumber,
    agentRegistrationNumber: profile.agentRegistrationNumber,
    agentRegistrationCommunity: profile.agentRegistrationCommunity,
    name: profile.name,
    surname: profile.surname,
    mainOfficeProvince: profile.mainOfficeProvince,
    mainOfficeCountry: 'España',
    //email: profile.email,
    telephone1: profile.telephone1,
    telephone2: profile.telephone2,
    profileSummary: profile.profileSummary,
    realEstateLogo: profile.realEstateLogo,
    userType: 'Agent',
    profilePicture: profile.profilePicture,
    subscription: profile.subscription,
  });

  // The profile loads asynchronously; sync it into the form when it
  // arrives, otherwise every field would stay empty
  useEffect(() => {
    if (profile && profile._id) {
      setFormData((prev) => ({
        ...prev,
        documentNumber: profile.documentNumber,
        agentRegistrationNumber: profile.agentRegistrationNumber,
        agentRegistrationCommunity: profile.agentRegistrationCommunity,
        name: profile.name,
        surname: profile.surname,
        mainOfficeProvince: profile.mainOfficeProvince,
        telephone1: profile.telephone1 || profile.telephone,
        telephone2: profile.telephone2,
        profileSummary: profile.profileSummary,
        realEstateLogo: profile.realEstateLogo,
        profilePicture: profile.profilePicture,
        subscription: profile.subscription,
      }));
    }
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;



    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await updateUser(profile._id, formData);

      setSnackbarMessage('Los campos se han guardado exitosamente en la base de datos');

      setOpenSnackbar(true);

    } catch (error) {
      console.error(error);

      setSnackbarMessage('Ha ocurrido un error al guardar los campos');

      setOpenSnackbar(true);
    }

  };

  return (

    // HEADINGS

    <div style={{ margin: '0 3rem 3rem 3rem' }}>
      
      <h1 style={{ marginTop: 0, background: '#31AFB4', color: 'white', padding: '0.5rem' }}><Header component="Mi Perfil"/></h1>


      {/* Avatar + search icon  */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mx: { xs: 2, md: 10 }, mt: '2rem' }}>
        {/* Avatar */}
        <div style={{ display: 'grid', gap: '1px', justifyItems: 'center', marginLeft: '14px' }}>
          <Avatar
            style={{ marginBottom: '2px', width: '80px', height: '80px' }}
            alt={getInitials(profile) || 'Avatar'}
            src={imageUrls[0] || profile.profilePicture || undefined}
            sx={{ fontSize: 28 }}
          >
            {getInitials(profile) || null}
          </Avatar>
        </div>
        {/* Upload button */}
        <div style={{ display: 'grid', gap: '2px', justifyItems: 'center', marginLeft: '14px' }}>
          <label htmlFor="contained-button-file">
            <Button
              style={{ marginTop: '8px' }}
              variant="outlined"
              color="primary"
              component="span"
            >
              <Images singular />
            </Button>
          </label>
        </div>
      </Box>

      <Box sx={{ mx: { xs: 2, md: 10 }, mt: 2 }}>
        {/*  DOCUMENTS */}
        <form onSubmit={handleSubmit}>
          <Paper elevation={3} style={{ padding: '3rem', marginLeft: "1rem", marginBottom: '2rem', marginTop: '2rem' }}>
            {/*<InputLabel id="Agent-label" htmlFor="documentType">Tipo Documento*</InputLabel>*/}
            <div style={{ margin: '0rem 2rem 2rem 2rem' }}>
              <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <FormControl style={{ width: '82%' }}>
                    {/* The floating label needs an explicit InputLabel to
                        match the rest of the fields */}
                    <InputLabel id="DocumentType-l">Tipo Documento</InputLabel>
                    <Select
                      name="DocumentType"
                      value={formData.DocumentType}
                      label="Tipo Documento"
                      onChange={handleChange}
                      labelId="DocumentType-l"
                      fullWidth
                      SelectProps={{ native: true }}
                    >
                      <MenuItem value="DNI">DNI</MenuItem>
                      <MenuItem value="NIE">NIE</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <FormControl style={{ width: '100%' }}>
                    <TextField
                      name="documentNumber"
                      label="Número Documento"
                      value={formData.documentNumber}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <FormControl style={{ width: '100%' }}>
                    <TextField
                      name="agentRegistrationNumber"
                      label="Número Registro Agente"
                      value={formData.agentRegistrationNumber || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <FormControl style={{ width: '100%' }}>
                    <TextField
                      name="agentRegistrationCommunity"
                      label="Comunidad / Región"
                      // Legacy profiles stored the INE object; show its name
                      value={typeof formData.agentRegistrationCommunity === 'object'
                        ? formData.agentRegistrationCommunity?.COM || ''
                        : formData.agentRegistrationCommunity || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
              </Grid> {/*Grid container*/}
            </div>

            {/*  CONTACT */}
            <div style={{ margin: '0rem 2rem 2rem 2rem' }}>
              <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <FormControl style={{ width: '100%' }}>
                    <TextField
                      name="name"
                      label="Nombre"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <FormControl style={{ width: '100%' }}>
                    <TextField
                      name="surname"
                      label="Apellidos"
                      value={formData.surname}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
              </Grid> {/*Grid container*/}
            </div>

            {/*  CONTACT */}
            <div style={{ margin: '0rem 2rem 2rem 2rem' }}>
              <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <FormControl style={{ width: '100%' }}>
                    <TextField
                      name="mainOfficeCountry"
                      label="Pais*"
                      value={formData.mainOfficeCountry || 'España'}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <FormControl style={{ width: '100%' }}>
                    <TextField
                      name="mainOfficeProvince"
                      label="Provincia / Región*"
                      // Legacy profiles stored the INE object; show its name
                      value={typeof formData.mainOfficeProvince === 'object'
                        ? formData.mainOfficeProvince?.PRO || ''
                        : formData.mainOfficeProvince || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
              </Grid> {/*Grid container*/}
            </div>

            <div style={{ margin: '0rem 2rem 2rem 2rem' }}>
              <Grid container spacing={2} bottom={"2rem"} >
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <FormControl style={{ width: '100%' }}>
                    <TextField
                      name="email"
                      label="Email"
                      value={profile.email || ''}
                      disabled
                      helperText="El email es tu nombre de usuario y no se puede cambiar"
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <FormControl style={{ width: '100%' }}>
                    <TextField
                      name="telephone1"
                      label="Teléfono"
                      value={formData.telephone1 || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <FormControl style={{ width: '100%' }}>
                    <TextField
                      name="telephone2"
                      label="Móvil"
                      value={formData.telephone2 || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
              </Grid> {/*Grid container*/}
            </div>
            {/* Boton de Resetear Password y checkbox susbcription*/}
            <div style={{ margin: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Checkbox color="primary" checked={subscription} onChange={handleCheckboxChange} />
                <span style={{ marginLeft: '0.5rem' }}>
                  Quiero recibir inspiración, promociones de marketing y actualizaciones vía email.
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="primary" variant="outlined" onClick={handleResetPasswordOpen}>Cambiar contraseña</Button>
              {open && <ResetPassword open={open} onClose={handleResetPasswordClose} userId={profile._id} email={profile.email}/>}
              </div>
            </div>
          </Paper>
        </form >
      </Box>

      {/* Botón de envío */}
      < div style={{ display: "flex", justifyContent: "flex-end", height: '2rem', marginBottom: "6rem"}}> {/* Esto es un hack para que el botón no tape los campos de texto */}
        < Button
          type="submit"
          variant="contained"
          color="primary"
          style={{
            margin: '0 1rem',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
          onClick={handleSubmit} >
          Guardar
        </Button >
      </div >

    {/* BACK BUTTON */}
      

      {/*  </Box>*/}
      <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          key={'bottom' + 'center'}
          style= {snackbarStyle}
        />
    </div >

   

  )
};