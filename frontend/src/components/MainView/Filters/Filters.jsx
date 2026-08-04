import { Box, Button, Divider, Fab, IconButton, Snackbar, Alert, Toolbar } from "@mui/material";
import { BathFilter, LocationFilter, PriceFilterMin, SquareMeters, RoomFilter, GaragesFilter, CheckboxesFilters, PriceFilterMax } from "../../FilterHousing";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import HousingContextFilter from "../../FilterHousing/HousingContextFilter";
import { AuthContext } from "../../Contexts/AuthContext";
import { addRequest } from "../../apiService/apiService";
import { useContext, useState } from "react";

function Filters(props) {

  const { resetFilters, room, baths, meter, garage, minPrice, maxPrice, checkbox, province, municipality, neighborhood, population } = useContext(HousingContextFilter);
  const { payload } = useContext(AuthContext);
  const [feedback, setFeedback] = useState(null); // { tipo, mensaje }

  const guardarRequerimiento = async () => {
    try {
      await addRequest({
        userId: payload?._id,
        transaction: "sale",
        community: province?.CCOM ? { CCOM: province.CCOM } : {},
        province: province || {},
        municipality: municipality || {},
        population: population || {},
        neighborhood: neighborhood || {},
        minM2: Number(meter) || 0,
        minPrice: Number(minPrice) || 0,
        maxPrice: Number(maxPrice) || 0,
        rooms: Number(room) || 1,
        baths: Number(baths) || undefined,
        garages: Number(garage) || undefined,
        currency: "EUR",
        // los nombres del modelo difieren de los del estado de checkboxes
        closets: checkbox.closet || undefined,
        airConditioned: checkbox.air_condicioned || undefined,
        heating: checkbox.heating || undefined,
        elevator: checkbox.elevator || undefined,
        outsideView: checkbox.outside_view || undefined,
        garden: checkbox.garden || undefined,
        pool: checkbox.pool || undefined,
        terrace: checkbox.terrace || undefined,
        storage: checkbox.storage || undefined,
        accessible: checkbox.accessible || undefined,
        title: `Búsqueda${province?.PRO ? ` en ${province.PRO}` : ""}${municipality?.DMUN ? ` - ${municipality.DMUN}` : ""}`,
      });
      setFeedback({ tipo: "success", mensaje: "Requerimiento guardado. Lo verás en la pestaña Requerimientos." });
    } catch (error) {
      console.error(error);
      setFeedback({ tipo: "error", mensaje: "No se pudo guardar el requerimiento." });
    }
  };

  return (

    <div>
      <Box sx={{
        position: 'fixed',
        left: '0px',
        top: '0px',
        zIndex: '9998',
        backgroundColor: '#ffffff', // Fondo blanco
        padding: '0px',
        width: '312px',
        height: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

      }}>
        <Button variant="contained" color="primary" onClick={guardarRequerimiento} style={{ position: 'relative' }}>
          Guardar Requerimiento
        </Button>
      </Box>

      <Snackbar open={!!feedback} autoHideDuration={4000} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={feedback?.tipo || "success"} onClose={() => setFeedback(null)}>{feedback?.mensaje}</Alert>
      </Snackbar>

      <Box
        sx={{
          position: 'fixed',
          left: '270px',
          bottom: '20px',
          zIndex: '9999',
        }}
      >
        <Fab
          color="action"
          aria-label="limpiar filtros"
          sx={{
            width: '30px', // Ajusta el ancho del botón
            height: '30px', // Ajusta el alto del botón
          }}
        >
          <IconButton
            aria-label="Limpiar Filtros"
            sx={{
              fontSize: '14px', // Ajusta el tamaño del ícono
            }}
            onClick={resetFilters} // Mueve el evento onClick aquí
          >
            <FilterAltOffIcon />
          </IconButton>
        </Fab>
      </Box>

      <Toolbar />
      <h3 style={{ marginLeft: '1em' }}>Ubicación</h3>
      <LocationFilter />
      <Divider />
      <h3 style={{ marginLeft: '1em' }}>Precio</h3>
      <PriceFilterMin />
      <PriceFilterMax />
      <br></br><br></br>
      <Divider />
      <h3 style={{ marginLeft: '1em' }}>M²</h3>
      <SquareMeters />
      <br></br><br></br>
      <Divider />
      <h3 style={{ marginLeft: '1em' }}>Caracteristicas</h3>
      <RoomFilter />
      <BathFilter />
      <GaragesFilter />
      <br></br><br></br>
      <Divider />
      <h3 style={{ marginLeft: '1em' }}>Equipamiento</h3>
      <CheckboxesFilters />
    </div>

  )
}

export default Filters;
