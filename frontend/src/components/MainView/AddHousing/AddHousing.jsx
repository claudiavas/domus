import React, { useState, useContext, useEffect } from 'react';
import { HousingContext } from '../../Contexts/HousingContext';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Paper, Grid, Switch, Fab, IconButton } from '@mui/material/';
import { addHousing } from '../../apiService/apiService';
import { Images } from '../Images/Images';
import { ImagesContext } from '../../Contexts/ImagesContext';
import { AuthContext } from '../../Contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { Header } from '../../HomePage/Header/Header';
import { Box } from '@mui/system';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { PlaceSearch } from '../../FilterHousing';

export const AddHousing = () => {

  const { housing, setHousing } = useContext(HousingContext);
  const { imageUrls, setImageUrls } = useContext(ImagesContext)
  const { profile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [lugarSeleccionado, setLugarSeleccionado] = useState();
  const [housingId, setHousingId] = useState("");

  const [formData, setFormData] = useState({
    country: 'España',
    showRealEstateLogo: true,
    user: profile._id,
    images: [],
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

  const createHousing = async () => {
    try {
      const response = await addHousing(formData);
      setHousingId(response.house._id);
      setHousing(prevHousing => [...prevHousing, response.house]);
    } catch (error) {
      console.error(error);
    }
  };  
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    await createHousing();

    // clearErrors();   
  };

  useEffect(() => {
    if (housingId && typeof housingId === 'string' && housingId.trim() !== '') {
      navigate(`/housingdetails/${housingId}`);
    }
  }, [housingId]);


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
      coordinates: place ? { lat: place.lat, lng: place.lng } : undefined,
    }));
  };


  return (

    //  HEADING

    <div style={{ margin: '0 3rem 3rem 3rem' }}>
      
      <h1 style={{ marginTop: 0, background: '#31AFB4', color: 'white', padding: '0.5rem' }}><Header component="Añadir Propiedad"/></h1>

      <form onSubmit={handleSubmit}>

        {/* TRANSACTION */}

        <Paper elevation={3} style={{ padding: '1rem', marginBottom: '0.6rem' }}>
          <Grid container spacing={1}>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <InputLabel id="type-label">Tipo de inmueble*</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  labelId="type-label"
                  label="Tipo de inmueble"
                >
                  <MenuItem value="apartment">Piso</MenuItem>
                  <MenuItem value="penthouse">Ático</MenuItem>
                  <MenuItem value="duplex">Duplex</MenuItem>
                  <MenuItem value="house">Casa</MenuItem>
                  <MenuItem value="chalet">Chalet</MenuItem>
                  <MenuItem value="other">Otro</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <InputLabel id="transaction-label">Tipo de transacción*</InputLabel>
                <Select
                  name="transaction"
                  value={formData.transaction}
                  onChange={handleChange}
                  labelId="transaction-label"
                  label="Tipo de transacción"
                >
                  <MenuItem value="sale">Venta</MenuItem>
                  <MenuItem value="rent">Alquiler</MenuItem>
                  <MenuItem value="vacation_rentals">Alquiler Vacacional</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <TextField
                  name="squareMeters"
                  label="Metros Cuadrados*"
                  value={formData.squareMeters}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <InputLabel id="currency-label">Moneda*</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  labelId="currency-label"
                  label="Moneda"
                >
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="DOL">DOL</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <TextField
                  name="price"
                  label="Precio*"
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
                      checked={formData.showRealEstateLogo}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Mostrar Logo Inmobiliaria"
                />
              </Grid>
            )}

            <Grid item xs={9}>
              <FormControl style={{ width: '85%' }}>
                <TextField
                  name="title"
                  label="Título"
                  value={formData.title}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid container item xs={12} spacing={2}>
              <Grid item xs={9}>
                <FormControl style={{ width: '85%' }}>
                  <TextField
                    name="description"
                    label="Descripción"
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
                  label="País*"
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
                label="Ubicación (ciudad, dirección…)*"
                sx={{ width: '95%' }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <FormControl style={{ width: '90%' }}>
                <TextField
                  name="zipCode"
                  label="Código Postal"
                  value={formData.zipCode || ''}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <FormControl style={{ width: '97%' }}>
                <TextField
                  name="roadName"
                  label="Vía"
                  value={formData.roadName || ''}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <FormControl style={{ width: '85%' }}>
                <TextField
                  name="houseNumber"
                  label="Número de portal"
                  value={formData.houseNumber}
                  onChange={handleChange}
                // error={!!errors.houseNumber}
                // helpertext={errors.houseNumber}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <FormControl style={{ width: '85%' }}>
                <TextField
                  name="floorNumber"
                  label="Número de Piso"
                  value={formData.floorNumber}
                  onChange={handleChange}
                // error={!!errors.floorNumber}
                // helpertext={errors.floorNumber}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <FormControl style={{ width: '85%' }}>
                <TextField
                  name="door"
                  label="Puerta"
                  value={formData.door}
                  onChange={handleChange}
                // error={!!errors.door}
                // helpertext={errors.door}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <FormControl style={{ width: '85%' }}>
                <TextField
                  name="stair"
                  label="Escalera"
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
                  label="Habitaciones*"
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
                  label="Baños"
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
                  label="Garajes"
                  value={formData.garages}
                  onChange={handleChange}
                // error={!!errors.garages}
                // helpertext={errors.garages}
                />
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <InputLabel id="floorLevel-label">Nivel del Piso</InputLabel>
                <Select
                  name="floorLevel"
                  value={formData.floorLevel}
                  onChange={handleChange}
                  labelId="floorLevel-label"
                  label="Nivel del Piso"
                >
                  <MenuItem value="top_floor">Último Piso</MenuItem>
                  <MenuItem value="intermediate_floor">Piso Intermedio</MenuItem>
                  <MenuItem value="ground_floor">Planta Baja</MenuItem>
                </Select>
              </FormControl>
            </Grid>



            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <InputLabel id="facing-label">Orientación</InputLabel>
                <Select
                  name="facing"
                  labelId="facing-label"
                  label="Orientación"
                  value={formData.facing}
                  onChange={handleChange}
                >
                  <MenuItem value="north">Norte</MenuItem>
                  <MenuItem value="south">Sur</MenuItem>
                  <MenuItem value="east">Este</MenuItem>
                  <MenuItem value="west">Oeste</MenuItem>

                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <InputLabel id="propertyAge-label">Antigüedad</InputLabel>
                <Select
                  name="propertyAge"
                  labelId="propertyAge-label"
                  label="Antigüedad"
                  value={formData.propertyAge}
                  onChange={handleChange}

                >
                  <MenuItem value="new">Nuevo</MenuItem>
                  <MenuItem value="up_to_5 years">Hasta 5 años</MenuItem>
                  <MenuItem value="6_to_10 years">De 6 a 10 años</MenuItem>
                  <MenuItem value="11_to_20 years">De 11 a 20 años</MenuItem>
                  <MenuItem value="more_than_20 years">Más de 20 años</MenuItem>

                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <InputLabel id="condition-label">Estado</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  labelId="condition-label"
                  label="Estado"
                >
                  <MenuItem value="new">Nuevo</MenuItem>
                  <MenuItem value="good_condition">Buen Estado</MenuItem>
                  <MenuItem value="to_renovate">Para Renovar</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <InputLabel id="furnished-label">Nivel de amueblado</InputLabel>
                <Select
                  name="furnished"
                  value={formData.furnished}
                  onChange={handleChange}
                  labelId="furnished-label"
                  label="Nivel de amueblado"
                >
                  <MenuItem value="unfurnished">Sin Amueblar</MenuItem>
                  <MenuItem value="semifurnished">Semi Amueblado</MenuItem>
                  <MenuItem value="furnished">Amueblado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl style={{ width: '75%' }}>
                <InputLabel id="kitchenEquipment-label">Equipamiento de Cocina</InputLabel>
                <Select
                  name="kitchenEquipment"
                  value={formData.kitchenEquipment}
                  onChange={handleChange}
                  labelId="kitchenEquipment-label"
                  label="Equipamiento de Cocina"
                >
                  <MenuItem value="standard_equipment">Equipamiento Estándar</MenuItem>
                  <MenuItem value="semi_equipped">Semi Equipado</MenuItem>
                  <MenuItem value="fully_equipped">Completamente Equipado</MenuItem>
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
                label="Aire Acondicionado"
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
                label="Calefacción"
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
                label="Ascensor"
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
                label="Trastero"
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
                label="Vistas al Exterior"
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
                label="Jardín"
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
                label="Piscina"
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
                label="Terraza"
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
                label="Armarios Empotrados"
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
                label="Accesible"
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
            Guardar
          </Button>
        </Box>

        {/* Botón para volver a la ventana de navegación anterior */}

        

      </form>
    </div>
  )
}