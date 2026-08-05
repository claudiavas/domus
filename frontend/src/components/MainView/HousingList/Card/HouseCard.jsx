import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogTitle, CardActionArea, CardActions, Box, Card, CardContent, CardMedia, Divider, Avatar, Chip, AlertTitle, Tooltip, IconButton } from '@mui/material';
import { PhotoCarousel } from './PhotoCarousel';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../../Contexts/AuthContext';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { PhoneNumber } from '../../Contact/PhoneNumber';
import { WhatsAppButton } from '../../Contact/WhatsappButton';
import { MiniMapa } from '../../HousingMap/MiniMapa';

export default function HouseCard({ _id, user, showRealEstateLogo, province, municipality, population, neighborhood, images, currency, price, squareMeters, rooms, transaction, type, furnished, garages, baths, title, pool, terrace, garden, coordinates, createdAt }) {
  const [mapaAbierto, setMapaAbierto] = useState(false);
  const { profile } = useContext(AuthContext);
  const navigate = useNavigate();
  const showThumbsValue = false;
  const {t} = useTranslation();
  console.log(`Translation key en housecard: housing.transaction.${transaction}`);

  const precioxm2 = (price / squareMeters).toFixed(0);
  let currencySymbol = '';
  if (currency === 'USD') {
    currencySymbol = '$';
  } else if (currency === 'EUR') {
    currencySymbol = '€';
  }

  const fechaPublicacion = createdAt
    ? new Date(createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const formattedPrice = (new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }))
    .format(price)
    .replace('.', ' ')
    .replace(',', ',');

  const removeTextInParentheses = (text) => {
    return text.replace(/\([^()]*\)/g, "").trim()
  };

  // Mongoose elimina los objetos vacíos al guardar: estos campos pueden faltar
  const locationText = [
    province?.PRO,
    municipality?.DMUN50,
    population?.NENTSI50,
    neighborhood?.NNUCLE50
  ]
    .filter(Boolean)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map(removeTextInParentheses)
    .join(", ");

  return (
    <Box
      component="main"
      onClick={() => navigate(`/housingdetails/${_id}`)}
      sx={{
        cursor: 'pointer',
        flexGrow: 3,
        display: 'flex',
        // En móvil la tarjeta se apila en columna; en escritorio, en fila
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: '10px', md: 0 },
        padding: 0,
        margin: { xs: '0 0 20px 0', md: '-5px 15px 20px -20px' },
        height: { xs: 'auto', md: '230px' },
      }}
    >
      <Box onClick={(e) => e.stopPropagation()} sx={{ flex: { md: '0 0 40%' }, maxWidth: { md: '40%' }, width: { xs: '100%', md: 'auto' }, cursor: 'default' }}>
        {/* LEFT SIDE */}
        <Card style={{ height: 230 }}>
          <PhotoCarousel
            showThumbs={showThumbsValue}
            images={images}
            extraSlide={coordinates?.lat ? <MiniMapa lat={coordinates.lat} lng={coordinates.lng} height={230} /> : null}
          />
        </Card>
      </Box>

      <Box component="span" sx={{ flex: '1 1 auto', minWidth: 0, mx: { md: '10px' }, p: 0 }}>
        {/* CENTER */}
        <span style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* TOP, CENTER */}
          <Card style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', margin: '0px 0px 8px 0px' }}>
            <div style={{ display: 'inline-flex', margin: '10px 10px 8px 5px' }}>
              {
                <>
                  <Chip label={t(`transaction.${transaction}`, {ns:"housing"})} color="primary" variant="contained" size="small" style={{ marginRight: '15px' }} />
                  <Chip label={t(`type.${type}`, {ns:"housing"})} color="primary" variant="outlined" size="small" style={{ marginRight: '15px' }} />
                  {pool ? <Chip label="Piscina" color="primary" variant="outlined" size="small" style={{ marginRight: '15px' }} />
                    : terrace ? <Chip label="Terraza" color="primary" variant="outlined" size="small" style={{ marginRight: '15px' }} />
                    : garden ? <Chip label="Jardín" color="primary" variant="outlined" size="small" style={{ marginRight: '15px' }} />
                    : furnished ? <Chip label={t(`furnished.${furnished}`, {ns:"housing"})} color="primary" variant="outlined" size="small" style={{ marginRight: '15px' }} /> : null}
                </>
              }
            </div>
            <h4 style={{ margin: '5px 5px 5px 5px', marginBottom: '5px', flexGrow: 1 }}>{title}</h4>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', flexGrow: 1 }}>
              <Tooltip title="Ver en el mapa" arrow>
                <IconButton
                  size="small"
                  color="primary"
                  sx={{ mr: '2px', p: '2px' }}
                  onClick={(e) => { e.stopPropagation(); setMapaAbierto(true); }}
                >
                  <LocationOnOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <h6 style={{ margin: '0px' }}>{locationText}</h6>
            </div>

            {/* Popup con la ubicación del inmueble */}
            <Dialog open={mapaAbierto} onClose={(e) => setMapaAbierto(false)} maxWidth="sm" fullWidth onClick={(e) => e.stopPropagation()}>
              <DialogTitle sx={{ py: 1.5, fontSize: 16 }}>{locationText}</DialogTitle>
              <Box sx={{ height: 380 }}>
                {mapaAbierto && coordinates?.lat && <MiniMapa lat={coordinates.lat} lng={coordinates.lng} />}
              </Box>
            </Dialog>
            {/* Separación uniforme entre datos a cualquier ancho (sin márgenes fijos) */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: { xs: 'space-between', sm: 'flex-start' }, columnGap: { sm: 4 }, rowGap: 0.5, mb: '5px', px: '5px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FullscreenOutlinedIcon sx={{ color: 'primary.main' }} />
                <h5 style={{ margin: 0 }}>{squareMeters} m2</h5>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BedOutlinedIcon sx={{ color: 'primary.main' }} />
                <h5 style={{ margin: 0 }}>{rooms}</h5>
              </Box>
              {baths ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BathtubIcon sx={{ color: 'primary.main' }} />
                  <h5 style={{ margin: 0 }}>{baths}</h5>
                </Box>
              ) : null}
              {garages ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DirectionsCarIcon sx={{ color: 'primary.main' }} />
                  <h5 style={{ margin: 0 }}>{garages}</h5>
                </Box>
              ) : null}
            </Box>

            {/* Asesor integrado: avatar pequeño + nombre + contacto, sin card aparte */}
            <Divider sx={{ mx: '5px' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: '8px', py: '4px' }}>
              <Avatar alt={`${user.name} ${user.surname}`} src={user.profilePicture} sx={{ width: 28, height: 28 }} />
              <Box component="span" sx={{ fontSize: 13, fontWeight: 500, flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name} {user.surname}
              </Box>
              {/* Los botones de contacto no deben navegar al detalle */}
              <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', alignItems: 'center' }}>
                {user.telephone1 && <WhatsAppButton phoneNumber={user.telephone1} />}
                {user.telephone2 && <PhoneNumber phoneNumber={user.telephone2} />}
                <Tooltip title={user.email} arrow>
                  <IconButton component="a" href={`mailto:${user.email}`} size="small" color="primary">
                    <EmailOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Precio integrado, con el mismo patrón de divisor que el asesor */}
            <Divider sx={{ mx: '5px' }} />
            <Box sx={{ px: '8px', py: '6px' }}>
              <h4 style={{ margin: '0px', padding: 0, color: "#31AFB4", display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                {/* En venta: precio total + €/m². En alquiler: €/mes. Vacacional: €/semana */}
                {transaction === 'sale' ? (
                  <>
                    {formattedPrice} {currencySymbol}
                    <div>{precioxm2} {currencySymbol}/m²</div>
                  </>
                ) : (
                  <span>{formattedPrice} {currencySymbol}/{transaction === 'rent' ? 'mes' : 'semana'}</span>
                )}
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {fechaPublicacion && (
                    <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: 12 }}>
                      Publicado el {fechaPublicacion}
                    </Box>
                  )}
                  <Box component="span" sx={{ color: 'primary.main', textDecoration: 'underline', fontWeight: 500, fontSize: 14 }}>Ver más</Box>
                </Box>
              </h4>
            </Box>
          </Card>
        </span>
      </Box>

    </Box >
  )
}
