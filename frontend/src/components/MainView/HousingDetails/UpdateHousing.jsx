import React, { useState, useContext, useEffect } from 'react';
import { TextField, Box, Fab, Button, FormControl, Link, InputLabel, Select, MenuItem, FormControlLabel, Paper, Grid, Switch, Typography } from '@mui/material/';
import { PlaceSearch } from '../../FilterHousing';
import { useTranslation } from 'react-i18next';
import { updateHousing } from '../../apiService/apiService';
import { Images } from '../Images/Images';
import { ImagesContext } from '../../Contexts/ImagesContext';
import { AuthContext } from '../../Contexts/AuthContext';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HousingContext } from '../../Contexts/HousingContext';
import { Header } from '../../HomePage/Header/Header';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
// import { useHistory } from "react-router-dom";

import IconButton from "@mui/material/IconButton";


export const UpdateHousing = () => {

  const { t } = useTranslation(['form', 'housing']);

  const { _id } = useParams();
  const location = useLocation();
  const { housing, setHousing } = useContext(HousingContext);
  const { housingData } = location.state;
  // const history = useHistory();

  const { imageUrls, setImageUrls } = useContext(ImagesContext)
  const { profile } = useContext(AuthContext);
  const navigate = useNavigate();

  // Legacy listings stored INE objects for the address parts; extract a
  // readable name either way
  const nombreLegado = (v) =>
    typeof v === 'object' ? v?.PRO || v?.DMUN50 || v?.NENTSI50 || v?.NNUCLE50 || '' : v || '';

  // Seed the place search with the listing's current location so the field
  // is not empty while editing
  const [lugarSeleccionado, setLugarSeleccionado] = useState(() => {
    const nombre = [housingData.population, housingData.municipality, housingData.province]
      .map(nombreLegado)
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .join(', ');
    return nombre
      ? { name: nombre, lat: housingData.coordinates?.lat, lng: housingData.coordinates?.lng }
      : undefined;
  });

  const [formData, setFormData] = useState({
    user: profile._id,
    images: [],
    title: housingData.title,
    showRealEstateLogo: housingData.showRealEstateLogo,
    type: housingData.type,
    transaction: housingData.transaction,
    country: housingData.country,
    province: housingData.province,
    zipCode: housingData.zipCode,
    roadName: housingData.roadName,
    coordinates: housingData.coordinates,
    squareMeters: housingData.squareMeters,
    currency: housingData.currency,
    price: housingData.price,
    houseNumber: housingData.houseNumber,
    floorLevel: housingData.floorLevel,
    floorNumber: housingData.floorNumber,
    door: housingData.door,
    stair: housingData.stair,
    facing: housingData.facing,
    propertyAge: housingData.propertyAge,
    description: housingData.description,
    rooms: housingData.rooms,
    baths: housingData.baths,
    garages: housingData.garages,
    condition: housingData.condition,
    furnished: housingData.furnished,
    kitchenEquipment: housingData.kitchenEquipment,
    closets: housingData.closets,
    airConditioned: housingData.airConditioned,
    heating: housingData.heating,
    elevator: housingData.elevator,
    outsideView: housingData.outsideView,
    garden: housingData.garden,
    pool: housingData.pool,
    terrace: housingData.terrace,
    storage: housingData.storage,
    accessible: housingData.accessible,
    status: housingData.status,
    isdeleted: housingData.isdeleted,
    deletedAt: housingData.deletedAt
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: imageUrls,
    }));
  }, [imageUrls]);


  // VALIDACIONES

  //   });


  // const { handleSubmit, setError, formState: { errors } } = useForm({
  //   });


  const handleSubmit = async (event) => {
    event.preventDefault();

    // clearErrors();   
    try {
      // await validationSchema.validate(formData, { abortEarly: false });
      const response = updateHousing(_id, formData);
      navigate(`/housingdetails/${housingData._id}`)
    } catch (error) {
      console.error(error);
    }
  };


  //   } catch (error) {
  //     error.inner.forEach((err) => {
  //       setError(err.path, {
  //         type: 'manual',
  //         message: err.message
  //       });
  //     })
  //   }
  // };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: fieldValue,
    }));
  };

  // The geocoder returns one place; split it into the address fields the
  // listing stores and keep the coordinates for the map and radius search
  const seleccionarLugar = (place) => {
    setLugarSeleccionado(place);
    const p = place?.properties || {};
    setFormData((prevFormData) => ({
      ...prevFormData,
      country: p.country || prevFormData.country,
      province: p.state || p.county || '',
      municipality: p.city || p.county || p.name || '',
      population: p.name || p.city || '',
      neighborhood: p.district || p.suburb || p.name || '',
      zipCode: p.postcode || prevFormData.zipCode || '',
      roadName: p.street || prevFormData.roadName || '',
      coordinates: place ? { lat: place.lat, lng: place.lng } : prevFormData.coordinates,
    }));
  };



  return (

    //  HEADING

    <div style={{ margin: '0 3rem 3rem 3rem' }}>
      <h1 style={{ marginTop: 0, background: '#31AFB4', color: 'white', padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}><Header component={t('form:editProperty')} /></h1>

      <form onSubmit={handleSubmit}>

        {/* TRANSACTION */}

        <Paper elevation={3} style={{ padding: '1rem', marginBottom: '0.6rem' }}>
          <Grid container spacing={1}>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <InputLabel InputLabelProps={{ shrink: true }} id="type-label">{t('form:propertyType')}</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  labelId="type-label"
                  label={t('form:propertyType')}
                >
                  <MenuItem value="apartment" sx={{ textTransform: 'capitalize' }}>{t(`housing:type.apartment`)}</MenuItem>
                  <MenuItem value="penthouse" sx={{ textTransform: 'capitalize' }}>{t(`housing:type.penthouse`)}</MenuItem>
                  <MenuItem value="duplex" sx={{ textTransform: 'capitalize' }}>{t(`housing:type.duplex`)}</MenuItem>
                  <MenuItem value="house" sx={{ textTransform: 'capitalize' }}>{t(`housing:type.house`)}</MenuItem>
                  <MenuItem value="chalet" sx={{ textTransform: 'capitalize' }}>{t(`housing:type.chalet`)}</MenuItem>
                  <MenuItem value="other" sx={{ textTransform: 'capitalize' }}>{t(`housing:type.other`)}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <InputLabel InputLabelProps={{ shrink: true }} id="transaction-label">{t('form:transactionType')}</InputLabel>
                <Select
                  name="transaction"
                  value={formData.transaction}
                  onChange={handleChange}
                  labelId="transaction-label"
                  label={t('form:transactionType')}
                >
                  <MenuItem value="sale" sx={{ textTransform: 'capitalize' }}>{t(`housing:transaction.sale`)}</MenuItem>
                  <MenuItem value="rent" sx={{ textTransform: 'capitalize' }}>{t(`housing:transaction.rent`)}</MenuItem>
                  <MenuItem value="vacation_rentals" sx={{ textTransform: 'capitalize' }}>{t(`housing:transaction.vacation_rentals`)}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <TextField InputLabelProps={{ shrink: true }}
                  name="squareMeters"
                  label={t('form:squareMeters')}
                  value={formData.squareMeters}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <InputLabel InputLabelProps={{ shrink: true }} id="currency-label">{t('form:currency')}</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  labelId="currency-label"
                  label={t('form:currency')}
                >
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="DOL">DOL</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <TextField InputLabelProps={{ shrink: true }}
                  name="price"
                  label={t('form:price')}
                  value={formData.price}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            {profile.realEstateLogo && (
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <FormControlLabel style={{ paddingLeft: "50px", width: '100%' }}
                  control={
                    <Switch
                      name="showRealEstateLogo"
                      checked={formData.showRealEstateLogo}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label={t('form:showAgencyLogo')}
                />
              </Grid>
            )}

            <Grid item xs={9}>
              <FormControl style={{ width: '85%' }}>
                <TextField InputLabelProps={{ shrink: true }}
                  name="title"
                  label={t('form:listingTitle')}
                  value={formData.title}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid container item xs={12} spacing={2}>
              <Grid item xs={9}>
                <FormControl style={{ width: '85%' }}>
                  <TextField InputLabelProps={{ shrink: true }}
                    name="description"
                    label={t('form:description')}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <Button
                  style={{ padding: "0px", width: '70%' }}
                  variant="outlined"
                  color="primary"
                >
                  <Images />
                </Button>
              </Grid>
            </Grid>

          </Grid>
        </Paper>


        {/* LOCATION */}

        <Paper elevation={3} style={{ padding: '1rem', marginBottom: '0.6rem' }}>
          <Grid container spacing={1}>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <TextField
                  name="country"
                  label={t('form:country')}
                  value={formData.country}
                  onChange={handleChange}
                // error={!!errors.country}
                // helpertext={errors.country}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={8} lg={8}>
              <PlaceSearch
                value={lugarSeleccionado}
                onPick={seleccionarLugar}
                label={t('form:locationSearch')}
                sx={{ width: '95%' }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <TextField InputLabelProps={{ shrink: true }}
                  name="zipCode"
                  label={t('form:zipCode')}
                  value={typeof formData.zipCode === 'object' ? formData.zipCode?.CPOS || '' : formData.zipCode || ''}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <FormControl style={{ width: '97%' }}>
                <TextField InputLabelProps={{ shrink: true }}
                  name="roadName"
                  label={t('form:street')}
                  value={typeof formData.roadName === 'object' ? formData.roadName?.NVIAC || '' : formData.roadName || ''}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} style={{ padding: '1rem', marginBottom: '0.6rem' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <FormControl style={{ width: '85%' }}>
                <TextField InputLabelProps={{ shrink: true }}
                  name="houseNumber"
                  label={t('form:portalNumber')}
                  value={formData.houseNumber}
                  onChange={handleChange}
                // error={!!errors.houseNumber}
                // helpertext={errors.houseNumber}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <FormControl style={{ width: '85%' }}>
                <TextField InputLabelProps={{ shrink: true }}
                  name="floorNumber"
                  label={t('form:floorNumber')}
                  value={formData.floorNumber}
                  onChange={handleChange}
                // error={!!errors.floorNumber}
                // helpertext={errors.floorNumber}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <FormControl style={{ width: '85%' }}>
                <TextField InputLabelProps={{ shrink: true }}
                  name="door"
                  label={t('form:door')}
                  value={formData.door}
                  onChange={handleChange}
                // error={!!errors.door}
                // helpertext={errors.door}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <FormControl style={{ width: '85%' }}>
                <TextField InputLabelProps={{ shrink: true }}
                  name="stair"
                  label={t('form:stair')}
                  value={formData.stair}
                  onChange={handleChange}
                // error={!!errors.stair}
                // helpertext={errors.stair}
                />
              </FormControl>
            </Grid>

          </Grid>
        </Paper>

        {/* CARACTERÍSTICAS PRINCIPALES */}

        <Paper elevation={3} style={{ padding: '1rem', marginBottom: '0.6rem' }}>
          <Grid container spacing={1}>

            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <TextField
                  name="rooms"
                  label={t('form:rooms')}
                  value={formData.rooms}
                  onChange={handleChange}
                // error={!!errors.rooms}
                // helpertext={errors.rooms}
                />
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <TextField
                  name="baths"
                  label={t('form:baths')}
                  value={formData.baths}
                  onChange={handleChange}
                // error={!!errors.baths}
                // helpertext={errors.baths}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <TextField
                  name="garages"
                  label={t('form:garages')}
                  value={formData.garages}
                  onChange={handleChange}
                // error={!!errors.garages}
                // helpertext={errors.garages}
                />
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <InputLabel id="floorLevel-label">{t('form:floorLevel')}</InputLabel>
                <Select
                  name="floorLevel"
                  value={formData.floorLevel}
                  onChange={handleChange}
                  labelId="floorLevel-label"
                  label={t('form:floorLevel')}
                >
                  <MenuItem value="top_floor" sx={{ textTransform: 'capitalize' }}>{t(`housing:floorLevel.top_floor`)}</MenuItem>
                  <MenuItem value="intermediate_floor" sx={{ textTransform: 'capitalize' }}>{t(`housing:floorLevel.intermediate_floor`)}</MenuItem>
                  <MenuItem value="ground_floor" sx={{ textTransform: 'capitalize' }}>{t(`housing:floorLevel.ground_floor`)}</MenuItem>
                </Select>
              </FormControl>
            </Grid>



            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <InputLabel id="facing-label">{t('form:facing')}</InputLabel>
                <Select
                  name="facing"
                  labelId="facing-label"
                  label={t('form:facing')}
                  value={formData.facing}
                  onChange={handleChange}
                >
                  <MenuItem value="north" sx={{ textTransform: 'capitalize' }}>{t(`housing:facing.north`)}</MenuItem>
                  <MenuItem value="south" sx={{ textTransform: 'capitalize' }}>{t(`housing:facing.south`)}</MenuItem>
                  <MenuItem value="east" sx={{ textTransform: 'capitalize' }}>{t(`housing:facing.east`)}</MenuItem>
                  <MenuItem value="west" sx={{ textTransform: 'capitalize' }}>{t(`housing:facing.west`)}</MenuItem>

                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <InputLabel id="propertyAge-label">{t('form:propertyAge')}</InputLabel>
                <Select
                  name="propertyAge"
                  labelId="propertyAge-label"
                  label={t('form:propertyAge')}
                  value={formData.propertyAge}
                  onChange={handleChange}

                >
                  <MenuItem value="new" sx={{ textTransform: 'capitalize' }}>{t(`housing:propertyAge.new`)}</MenuItem>
                  <MenuItem value="up_to_5 years" sx={{ textTransform: 'capitalize' }}>{t(`housing:propertyAge.up_to_5 years`)}</MenuItem>
                  <MenuItem value="6_to_10 years" sx={{ textTransform: 'capitalize' }}>{t(`housing:propertyAge.6_to_10 years`)}</MenuItem>
                  <MenuItem value="11_to_20 years" sx={{ textTransform: 'capitalize' }}>{t(`housing:propertyAge.11_to_20 years`)}</MenuItem>
                  <MenuItem value="more_than_20 years" sx={{ textTransform: 'capitalize' }}>{t(`housing:propertyAge.more_than_20 years`)}</MenuItem>

                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <InputLabel id="condition-label">{t('form:condition')}</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  labelId="condition-label"
                  label={t('form:condition')}
                >
                  <MenuItem value="new" sx={{ textTransform: 'capitalize' }}>{t(`housing:condition.new`)}</MenuItem>
                  <MenuItem value="good_condition" sx={{ textTransform: 'capitalize' }}>{t(`housing:condition.good_condition`)}</MenuItem>
                  <MenuItem value="to_renovate" sx={{ textTransform: 'capitalize' }}>{t(`housing:condition.to_renovate`)}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <InputLabel id="furnished-label">{t('form:furnished')}</InputLabel>
                <Select
                  name="furnished"
                  value={formData.furnished}
                  onChange={handleChange}
                  labelId="furnished-label"
                  label={t('form:furnished')}
                >
                  <MenuItem value="unfurnished" sx={{ textTransform: 'capitalize' }}>{t(`housing:furnished.unfurnished`)}</MenuItem>
                  <MenuItem value="semifurnished" sx={{ textTransform: 'capitalize' }}>{t(`housing:furnished.semifurnished`)}</MenuItem>
                  <MenuItem value="furnished" sx={{ textTransform: 'capitalize' }}>{t(`housing:furnished.furnished`)}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <InputLabel id="kitchenEquipment-label">{t('form:kitchenEquipment')}</InputLabel>
                <Select
                  name="kitchenEquipment"
                  value={formData.kitchenEquipment}
                  onChange={handleChange}
                  labelId="kitchenEquipment-label"
                  label={t('form:kitchenEquipment')}
                >
                  <MenuItem value="standard_equipment" sx={{ textTransform: 'capitalize' }}>{t(`housing:kitchenEquipment.standard_equipment`)}</MenuItem>
                  <MenuItem value="semi_equipped" sx={{ textTransform: 'capitalize' }}>{t(`housing:kitchenEquipment.semi_equipped`)}</MenuItem>
                  <MenuItem value="fully_equipped" sx={{ textTransform: 'capitalize' }}>{t(`housing:kitchenEquipment.fully_equipped`)}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

          </Grid>
        </Paper>

        {/* CARACTERÍSTICAS ADICIONALES */}

        <Paper elevation={3} style={{ padding: '1rem', marginBottom: '0.6rem' }}>
          <Grid container spacing={1}>


            <Grid item xs={12} sm={6} md={6} lg={2.4}>
              <FormControlLabel style={{ width: '100%' }}
                control={
                  <Switch
                    name="airConditioned"
                    type="checkbox"
                    checked={formData.airConditioned}
                    onChange={handleChange}
                  />
                }
                label={t('form:airConditioned')}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={2.4}>
              <FormControlLabel style={{ width: '100%' }}
                control={
                  <Switch
                    name="heating"
                    checked={formData.heating}
                    onChange={handleChange}
                  />
                }
                label={t('form:heating')}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={2.4}>
              <FormControlLabel style={{ width: '100%' }}
                control={
                  <Switch
                    name="elevator"
                    checked={formData.elevator}
                    onChange={handleChange}
                  />
                }
                label={t('form:elevator')}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={2.4}>
              <FormControlLabel style={{ width: '100%' }}
                control={
                  <Switch
                    name="storage"
                    checked={formData.storage}
                    onChange={handleChange}
                  />
                }
                label={t('form:storage')}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={2.4}>
              <FormControlLabel style={{ width: '100%' }}
                control={
                  <Switch
                    name="outsideView"
                    checked={formData.outsideView}
                    onChange={handleChange}
                  />
                }
                label={t('form:outsideView')}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={2.4}>
              <FormControlLabel style={{ width: '100%' }}
                control={
                  <Switch
                    name="garden"
                    checked={formData.garden}
                    onChange={handleChange}
                  />
                }
                label={t('form:garden')}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={2.4}>
              <FormControlLabel style={{ width: '100%' }}
                control={
                  <Switch
                    name="pool"
                    checked={formData.pool}
                    onChange={handleChange}
                  />
                }
                label={t('form:pool')}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={2.4}>
              <FormControlLabel style={{ width: '100%' }}
                control={
                  <Switch
                    name="terrace"
                    checked={formData.terrace}
                    onChange={handleChange}
                  />
                }
                label={t('form:terrace')}
              />
            </Grid>


            <Grid item xs={12} sm={6} md={6} lg={2.4}>
              <FormControlLabel style={{ width: '100%' }}
                control={
                  <Switch
                    name="closets"
                    checked={formData.closets}
                    onChange={handleChange}
                  />
                }
                label={t('form:closets')}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={2.4}>
              <FormControlLabel style={{ width: '100%' }}
                control={
                  <Switch
                    name="accessible"
                    checked={formData.accessible}
                    onChange={handleChange}
                  />
                }
                label={t('form:accessible')}
              />
            </Grid>

          </Grid>
        </Paper>

        {/* BOTÓN GUARDAR: siempre visible al pie */}
        <Box sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          backgroundColor: '#fff',
          borderTop: '1px solid #eee',
          py: 1.5,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>

          <Button variant="contained" color="primary" type="submit">
            {t('form:save')}
          </Button>

          {/* Botón para volver a la ventana de navegación anterior */}

          
        </Box>

      </form >

    </div >
  )
}