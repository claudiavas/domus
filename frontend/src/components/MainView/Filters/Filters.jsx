import { Box, Button, Divider, Fab, IconButton, Snackbar, Alert, Toolbar } from "@mui/material";
import { BathFilter, LocationFilter, PriceFilterMin, SquareMeters, RoomFilter, GaragesFilter, CheckboxesFilters, PriceFilterMax } from "../../FilterHousing";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import HousingContextFilter from "../../FilterHousing/HousingContextFilter";
import { AuthContext } from "../../Contexts/AuthContext";
import { addRequest } from "../../apiService/apiService";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function Filters(props) {

  const { resetFilters, room, baths, meter, garage, minPrice, maxPrice, checkbox, province, municipality, neighborhood, population } = useContext(HousingContextFilter);
  const { payload } = useContext(AuthContext);
  const [feedback, setFeedback] = useState(null); // { tipo, mensaje }
  const navigate = useNavigate();

  const guardarRequerimiento = async () => {
    // Guardar requerimientos requiere sesión: el listado es público
    if (!payload?._id) {
      navigate("/login");
      return;
    }
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
      {/* Cabecera del panel en flujo normal (sticky): funciona igual en el
          Drawer permanente de escritorio y en el temporal de móvil */}
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        py: 2,
        borderBottom: '1px solid #eee',
      }}>
        <Button variant="contained" color="primary" onClick={guardarRequerimiento}>
          Guardar Requerimiento
        </Button>
        <IconButton aria-label="Limpiar filtros" onClick={resetFilters} size="small" sx={{ border: '1px solid #ddd' }}>
          <FilterAltOffIcon fontSize="small" />
        </IconButton>
      </Box>

      <Snackbar open={!!feedback} autoHideDuration={4000} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={feedback?.tipo || "success"} onClose={() => setFeedback(null)}>{feedback?.mensaje}</Alert>
      </Snackbar>

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
