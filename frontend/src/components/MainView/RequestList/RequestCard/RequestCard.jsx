import React, { useContext } from 'react';
import { Button, Grid, Typography, Checkbox, CardActionArea, CardActions, Box, Card, CardContent, CardMedia, Divider, Avatar, Chip, AlertTitle, Tooltip, IconButton } from '@mui/material';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../../Contexts/AuthContext';
import HousingContextFilter from '../../../FilterHousing/HousingContextFilter';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { PhoneNumber } from '../../Contact/PhoneNumber';
import { WhatsAppButton } from '../../Contact/WhatsappButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { useTranslation } from 'react-i18next';
import { updateRequest } from '../../../apiService/apiService'


export function RequestCard({ user, title, showRealEstateLogo, type, transaction, country, province, municipality, population, neighborhood,
  minM2, maxM2, currency, minPrice, maxPrice, floorLevel,
  facing, propertyAge, rooms, baths, garages, condition, furnished, kitchenEquipment,
  closets, airConditioned, heating, elevator, outsideView, garden, pool, terrace, storage,
  accessible, _id, requestCompleta, alUsarBusqueda }) {

  const { t } = useTranslation();
  const tu = (k) => t(k, { ns: 'ui' });
  const navigate = useNavigate()
  const showThumbsValue = false;
  const { profile } = useContext(AuthContext);
  const filtros = useContext(HousingContextFilter);

  // Applies the saved criteria to the filter panel and jumps to the listings tab
  const usarBusqueda = () => {
    const r = requestCompleta || {};
    filtros.setProvince(r.province?.CPRO ? r.province : undefined);
    filtros.setMunicipality(r.municipality?.CMUM ? r.municipality : undefined);
    filtros.setPopulation(r.population?.CPOB || r.population?.NENTSI50 ? r.population : undefined);
    filtros.setNeighborhood(r.neighborhood?.NNUCLE50 ? r.neighborhood : undefined);
    filtros.setMinPrice(r.minPrice || '');
    filtros.setMaxPrice(r.maxPrice || '');
    filtros.setRoom(r.rooms > 1 ? String(r.rooms) : '');
    filtros.setBaths(r.baths ? String(r.baths) : '');
    filtros.setGarage(r.garages ? String(r.garages) : '');
    filtros.setMeter(r.minM2 || 0);
    filtros.setCheckbox({
      closet: !!r.closets,
      air_condicioned: !!r.airConditioned,
      heating: !!r.heating,
      elevator: !!r.elevator,
      outside_view: !!r.outsideView,
      garden: !!r.garden,
      pool: !!r.pool,
      terrace: !!r.terrace,
      storage: !!r.storage,
      accessible: !!r.accessible,
    });
    if (alUsarBusqueda) alUsarBusqueda();
  };



  const booleanItems = [
    airConditioned && { label: 'Aire acondicionado', value: airConditioned },
    heating && { label: 'Calefacción', value: heating },
    elevator && { label: 'Ascensor', value: elevator },
    storage && { label: 'Trastero', value: storage },
    outsideView && { label: 'Vista Exterior', value: outsideView },
    garden && { label: 'Jardín', value: garden },
    pool && { label: 'Piscina', value: pool },
    terrace && { label: 'Terraza', value: terrace },
    closets && { label: 'Closets', value: closets },
    accessible && { label: 'Accesible', value: accessible },
  ];

  const halfLength = Math.ceil(booleanItems.length / 2);
  const firstHalf = booleanItems.slice(0, halfLength);
  const secondHalf = booleanItems.slice(halfLength);


  let currencySymbol = '';
  if (currency === 'USD') {
    currencySymbol = '$';
  } else if (currency === 'EUR') {
    currencySymbol = '€';
  }

  // LE DAMOS FORMATO AL PRECIO
  // LE damos formato al precio minimo y al precio maximo
  const formattedMinPrice = (new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }))
    .format(minPrice)
    .replace('.', ' ')
    .replace(',', ',');
  const formattedMaxPrice = (new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }))
    .format(maxPrice)
    .replace('.', ' ')
    .replace(',', ',');

  // LE DAMOS FORMATO A LA UBICACIÓN

  const removeTextInParentheses = (text) => {
    return text.replace(/\([^()]*\)/g, "").trim()
  };
  


  const locationText = [
    province?.PRO,
    municipality?.DMUN50,
    population?.NENTSI50,
    neighborhood?.NNUCLE50
  ]
    .filter(Boolean)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map(removeTextInParentheses)
    .join(", ")

    const handleDeleteRequest = async (_id, status) => {
      updateRequest(_id, { status: "DELETED" });
        navigate("/");
        alert("Requerimiento eliminado correctamente")
    }

  return (
    <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header row: chips on the left, actions on the top-right corner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {transaction && <Chip label={t(`transaction.${transaction}`, { ns: "housing" })} color="primary" variant="contained" size="small" />}
          {type && <Chip label={t(`type.${type}`, { ns: "housing" })} color="primary" variant="outlined" size="small" />}
          {furnished && <Chip label={t(`furnished.${furnished}`, { ns: "housing" })} color="primary" variant="outlined" size="small" />}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
          <Tooltip title={tu('useSearch')} arrow>
            <IconButton size="small" color="primary" onClick={usarBusqueda}>
              <ManageSearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {user?._id && user._id === profile?._id && (
            <Tooltip title={tu('deleteSearch')} arrow>
              <IconButton size="small" color="primary" onClick={handleDeleteRequest}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <h4 style={{ margin: '0 0 6px 0' }}>{title || tu('savedSearch')}</h4>

      {locationText && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnOutlinedIcon fontSize="small" sx={{ mr: '5px', color: 'primary.main' }} />
          <h6 style={{ margin: 0 }}>{locationText}</h6>
        </Box>
      )}

      {/* Criteria row, mirroring the listing card layout */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-start', columnGap: { xs: 3, sm: 4 }, rowGap: 0.5, mb: 1 }}>
        {minM2 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FullscreenOutlinedIcon sx={{ color: 'primary.main' }} />
            <h5 style={{ margin: 0 }}>{minM2}+ m2</h5>
          </Box>
        ) : null}
        {rooms ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BedOutlinedIcon sx={{ color: 'primary.main' }} />
            <h5 style={{ margin: 0 }}>{rooms}+</h5>
          </Box>
        ) : null}
        {baths ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BathtubIcon sx={{ color: 'primary.main' }} />
            <h5 style={{ margin: 0 }}>{baths}+</h5>
          </Box>
        ) : null}
        {garages ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DirectionsCarIcon sx={{ color: 'primary.main' }} />
            <h5 style={{ margin: 0 }}>{garages}+</h5>
          </Box>
        ) : null}
      </Box>

      {/* Requested amenities as small chips */}
      {booleanItems.some(Boolean) && (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
          {booleanItems.filter(Boolean).map((item) => (
            <Chip key={item.label} label={item.label} size="small" variant="outlined" />
          ))}
        </Box>
      )}

      {/* Price strip with its subtle divider, as in the listing card */}
      <Divider sx={{ mx: '-8px', mt: 'auto' }} />
      <Box sx={{ pt: '6px' }}>
        <h4 style={{ margin: 0, color: '#31AFB4' }}>
          {minPrice ? `${tu('fromPrice')} ${formattedMinPrice} ${currencySymbol}` : ''}
          {minPrice && maxPrice ? ' · ' : ''}
          {maxPrice ? `${tu('toPrice')} ${formattedMaxPrice} ${currencySymbol}` : ''}
          {!minPrice && !maxPrice ? tu('noPriceLimit') : ''}
        </h4>
      </Box>
    </Card>
  )
}
