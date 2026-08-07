import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { Grid, Typography, TextField, Input, Card, Chip, Divider, Checkbox } from '@mui/material/';
import Paper from '@mui/material/Paper';
import { getActiveHousing, getHouse, updateHousing } from '../../apiService/apiService';
import { PhotoGallery } from './PhotoGallery';
import { PhotoCarousel } from '../HousingList/Card/PhotoCarousel';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../Contexts/AuthContext';
import { HousingContext } from '../../Contexts/HousingContext';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { PhoneNumber } from '../Contact/PhoneNumber';
import { WhatsAppButton } from '../Contact/WhatsappButton';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Avatar } from '@mui/material';
import { Tooltip } from '@mui/material';
import { Header } from '../../HomePage/Header/Header';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

export const HousingDetails = () => {

  const navigate = useNavigate()
  const { _id } = useParams();
  const { housing } = useContext(HousingContext);
  const { profile } = useContext(AuthContext);
  const {t} = useTranslation();

  const housingData = housing.find((item) => item._id === _id);


  useEffect(() => {
  }, [housing]);

  if (!housingData) {
    return <div>Vivienda no encontrada</div>;
  }
  const user = housingData.user


  const precioxm2 = (housingData.price / housingData.squareMeters).toFixed(0);
  let currencySymbol = '';
  if (housingData.currency === 'USD') {
    currencySymbol = '$';
  } else if (housingData.currency === 'EUR') {
    currencySymbol = '€';
  }

  const formattedPrice = (new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }))
    .format(housingData.price)
    .replace('.', ' ')
    .replace(',', ',');

  const removeTextInParentheses = (text) => {
    return text.replace(/\([^()]*\)/g, "").trim()
  };

  const locationText = [
    housingData.province?.PRO || housingData.province,
    housingData.municipality?.DMUN50 || housingData.municipality,
    housingData.population?.NENTSI50 || housingData.population,
    housingData.neighborhood?.NNUCLE50 || housingData.neighborhood
  ]
    .filter((value) => typeof value === 'string')
    .filter(Boolean)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map(removeTextInParentheses)
    .join(", ");


  const booleanItems = [
    housingData.airConditioned && { label: 'Aire acondicionado', value: housingData.airConditioned },
    housingData.heating && { label: 'Calefacción', value: housingData.heating },
    housingData.elevator && { label: 'Ascensor', value: housingData.elevator },
    housingData.storage && { label: 'Trastero', value: housingData.storage },
    housingData.outsideView && { label: 'Vista Exterior', value: housingData.outsideView },
    housingData.garden && { label: 'Jardín', value: housingData.garden },
    housingData.pool && { label: 'Piscina', value: housingData.pool },
    housingData.terrace && { label: 'Terraza', value: housingData.terrace },
    housingData.closets && { label: 'Closets', value: housingData.closets },
    housingData.accessible && { label: 'Accesible', value: housingData.accessible },
  ];

  const halfLength = Math.ceil(booleanItems.length / 2);
  const firstHalf = booleanItems.slice(0, halfLength);
  const secondHalf = booleanItems.slice(halfLength);
  
  const transaction = housingData.transaction
  const type = housingData.type
  const furnished = housingData.furnished
  const floorLevel = housingData.floorLevel
  const facing = housingData.facing
  const propertyAge = housingData.propertyAge
  const condition = housingData.condition
  const kitchenEquipment = housingData.kitchenEquipment


  const handleDeleteHousing = async (_id, status) => {
    updateHousing(_id, { status: "DELETED" });
      navigate("/mainview");
      alert("Vivienda eliminada correctamente")
  
  }

  return (
    <Box sx={{ pb: '3rem' }}>
      {/* Full-width heading bar */}
      <Box sx={{ background: '#31AFB4', color: 'white', p: '0.5rem', mb: 2 }}><Header component={t('detailTitle', {ns:'ui'})} /></Box>

      <Box sx={{ px: { xs: 1.5, md: '3rem' } }}>
      {/* Photos: tiled gallery on desktop, swipeable carousel on mobile */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <PhotoGallery itemData={housingData.images} />
      </Box>
      <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 2 }}>
        <PhotoCarousel showThumbs={false} images={housingData.images} />
      </Box>

      <Grid container spacing={1}>
        {/* TITLE */}
        <Grid item xs={12} md={12} lg={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {housingData.title && <Typography variant="h6">{housingData.title}</Typography>}
          {housingData.user._id === profile._id && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title={t('edit', {ns:'ui'})} arrow>
                <IconButton color="primary" onClick={() => navigate(`/updatehousing/${_id}`, { state: { housingData } })}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('delete', {ns:'ui'})} arrow>
                <IconButton sx={{ color: 'text.secondary' }} onClick={() => handleDeleteHousing(_id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Grid>


        {/* FIRST COLUMN */}

        {/* CHIPS */}
        <Grid item xs={12} md={6} lg={5} >

          <Card style={{ height: "100%" }}>
            <div style={{ padding: "8px 8px 8px 8px", display: 'inline-flex' }}>
              <Chip label={t(`transaction.${transaction}`, {ns:"housing"})} color="primary" variant="contained" size="small" style={{ marginRight: '15px' }} />
              <Chip label={t(`type.${type}`, {ns:"housing"})} color="primary" variant="outlined" size="small" style={{ marginRight: '15px' }} />
              {housingData.furnished && <Chip label={t(`furnished.${furnished}`, {ns:"housing"})} color="primary" variant="outlined" size="small" style={{ marginRight: '15px' }} />}
            </div>


            {/* LOCATION */}

            <div style={{ padding: "8px 8px 8px 8px", display: 'flex', alignItems: 'center', marginBottom: '5px', flexGrow: 1 }}>
              <LocationOnOutlinedIcon style={{ marginRight: '5px' }} />
              <h6 style={{ margin: '0px' }}>{locationText}</h6>
            </div>


            {/* ADDRESS */}

            <Grid item xs={6} style={{ padding: "8px 8px 8px 8px" }}>
              {housingData.houseNumber && <Typography>Número de portal: {housingData.houseNumber}</Typography>}
              {housingData.floor && <Typography>Piso: {housingData.floor}</Typography>}
              {housingData.door && <Typography>Puerta: {housingData.door}</Typography>}
              {housingData.stair && <Typography>Escalera: {housingData.stair}</Typography>}
            </Grid>

            <Divider style={{ margin: "10px" }} />

            {/* DESCRIPTION */}

            <div style={{ padding: "8px 8px 8px 8px" }}>
              {housingData.description && <Typography variant="p">{housingData.description}</Typography>}
            </div>
          </Card>
        </Grid>

        {/* SECOND COLUMN */}
        <Grid item xs={12} md={6} lg={5} style={{ position: 'sticky', top: 0, zIndex: 999, height: '100%' }}>
          {/* MAIN ICONS */}
          <Card style={{ padding: "8px 8px 8px 8px", height: "100%" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: { xs: 'space-between', sm: 'flex-start' }, columnGap: { sm: 4 }, rowGap: 0.5, mb: '5px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FullscreenOutlinedIcon sx={{ color: 'primary.main' }} />
                <h5 style={{ margin: 0 }}>{housingData.squareMeters} m2</h5>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BedOutlinedIcon sx={{ color: 'primary.main' }} />
                <h5 style={{ margin: 0 }}>{housingData.rooms}</h5>
              </Box>
              {housingData.baths ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BathtubIcon sx={{ color: 'primary.main' }} />
                  <h5 style={{ margin: 0 }}>{housingData.baths}</h5>
                </Box>
              ) : null}
              {housingData.garages ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DirectionsCarIcon sx={{ color: 'primary.main' }} />
                  <h5 style={{ margin: 0 }}>{housingData.garages}</h5>
                </Box>
              ) : null}
            </Box>

            <Divider style={{ margin: "10px" }} />

            {/* TEXT ESPECIFICATIONS */}

            <div style={{ padding: "8px 8px 8px 8px" }}>
              {/* Label-value rows stay aligned even when a label wraps */}
              {[
                housingData.floorLevel && [t('floorLevel', {ns:'ui'}), t(`floorLevel.${floorLevel}`, {ns:"housing"})],
                housingData.facing && [t('orientation', {ns:'ui'}), t(`facing.${facing}`, {ns:"housing"})],
                housingData.propertyAge && [t('propertyAge', {ns:'ui'}), t(`propertyAge.${propertyAge}`, {ns:"housing"})],
                housingData.condition && [t('condition', {ns:'ui'}), t(`condition.${condition}`, {ns:"housing"})],
                housingData.furnished && [t('furnishedLabel', {ns:'ui'}), t(`furnished.${furnished}`, {ns:"housing"})],
                housingData.kitchenEquipment && [t('kitchen', {ns:'ui'}), t(`kitchenEquipment.${kitchenEquipment}`, {ns:"housing"})],
              ].filter(Boolean).map(([etiqueta, valor]) => (
                <Box key={etiqueta} sx={{ display: 'flex', gap: 1, py: 0.25 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexBasis: '45%', flexShrink: 0 }}>{etiqueta}:</Typography>
                  <Typography variant="subtitle1" sx={{ overflowWrap: 'anywhere' }}>{valor}</Typography>
                </Box>
              ))}
            </div>

            <Divider style={{ margin: "10px" }} />

            {/* BOOLEAN ESPECIFICATIONS */}
            <Grid container spacing={0.5}>
              {booleanItems.map((item, index) => (
                item && (
                  <Grid item xs={6} key={index}>
                    <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox checked={true} sx={{ py: 0.5 }} />
                      <span>{item.label}</span>
                    </Typography>
                  </Grid>
                )
              ))}
            </Grid>



          </Card>
        </Grid>


        {/* THIRD COLUMN */}

        <Grid item xs={12} md={4} lg={2} style={{ position: 'sticky', top: 0, zIndex: 999 }}>
          {/* PRICING */}

          <Card style={{ height: "100%" }}>
            <div style={{ margin: '8px 8px 8px 8px' }}>
              <h4 style={{ margin: '0px', padding: 0, color: "#31AFB4", alignItems: "center" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Typography>Precio:</Typography> {formattedPrice} {currencySymbol}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Typography>Precio/m2:</Typography> {precioxm2} {currencySymbol}</div>
              </h4>
            </div>

            <Divider style={{ margin: "10px" }} />


            {/* AGENT */}


            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
              {user.realEstateLogo && housingData.showRealEstateLogo && user.profilePicture ? (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><Avatar alt="profile picture" src={user.profilePicture} sx={{ width: 56, height: 56 }} /></div>
                  <div><Avatar alt="real estate logo" src={user.realEstateLogo} sx={{ width: 75, height: 75 }} /></div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {user.profilePicture ? (
                    <div><Avatar alt="profile picture" src={user.profilePicture} sx={{ width: 56, height: 56 }} /></div>
                  ) : (
                    <Avatar sx={{ width: 56, height: 56 }} />
                  )}
                </div>
              )}
            </div>

            <div style={{ alignSelf: 'center', marginTop: '20px', marginBottom: '20px' }}>
              <h4 style={{ fontWeight: 'bold', textAlign: 'center', margin: '0px' }}>
                {user.name} {user.surname}
              </h4>
            </div>
            <div style={{ justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
              {user.agentRegistrationNumber && user.agentRegistrationCommunity && (
                <Tooltip title={`Registro No. ${profile.agentRegistrationNumber} C.A. de ${profile.agentRegistrationCommunity}`}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size="small" color="success" style={{ margin: '0 2px 0 0' }}>
                      <CardMembershipIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">{`${profile.agentRegistrationNumber} C.A. de ${profile.agentRegistrationCommunity}`}</Typography>
                  </div>
                </Tooltip>
              )}
            </div>

            <div style={{ justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
              {user.telephone1 && (
                <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 2px 0' }}>
                  <WhatsAppButton phoneNumber={user.telephone1} />
                  <Typography variant="body2" style={{ margin: '0 0 0 5px' }}>{user.telephone1}</Typography>
                </div>
              )}
              {user.telephone2 && (
                <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 2px 0' }}>
                  <PhoneNumber phoneNumber={user.telephone2} />
                  <Typography variant="body2" style={{ margin: '0 0 0 10px' }}>{user.telephone2}</Typography>
                </div>
              )}
              <Tooltip title={user.email} arrow>
                <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 2px 0' }}>
                  <IconButton component="a" href={`mailto:${user.email}`} size="extra-small" color="primary" style={{ margin: '0 1px 0 0' }}>
                    <EmailOutlinedIcon fontSize="small" />
                  </IconButton>
                    <Typography style={{fontSize: "11px"}} variant="body2">{user.email}</Typography>
                </div>
              </Tooltip>
            </div>



          </Card>
        </Grid>
      </Grid>

      <Box>


            {/* Botón para volver a la ventana de navegación anterior */}

        

      </Box>
      </Box>
    </Box>
  );

} 