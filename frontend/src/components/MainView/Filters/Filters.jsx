import { Box, Button, Divider, Fab, IconButton, Snackbar, Alert, Toolbar } from "@mui/material";
import { BathFilter, LocationFilter, PriceFilterMin, SquareMeters, RoomFilter, GaragesFilter, CheckboxesFilters, PriceFilterMax } from "../../FilterHousing";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import CloseIcon from '@mui/icons-material/Close';
import HousingContextFilter from "../../FilterHousing/HousingContextFilter";
import { AuthContext } from "../../Contexts/AuthContext";
import { addRequest } from "../../apiService/apiService";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function Filters(props) {

  const { resetFilters, room, baths, meter, garage, minPrice, maxPrice, checkbox, province, municipality, neighborhood, population } = useContext(HousingContextFilter);
  const { payload, profile } = useContext(AuthContext);
  const [feedback, setFeedback] = useState(null); // { tipo, mensaje }
  const navigate = useNavigate();

  // El _id puede venir del payload, del profile, o del propio token si los
  // contextos aún no cargaron (p. ej. justo después de iniciar sesión)
  const idDesdeToken = () => {
    try {
      const token = localStorage.getItem('token');
      return token ? JSON.parse(atob(token.split('.')[1]))._id : null;
    } catch { return null; }
  };

  const hayFiltros = () =>
    province || municipality || population || neighborhood ||
    minPrice || maxPrice || room || baths || garage || Number(meter) > 0 ||
    Object.values(checkbox).some(Boolean);

  const guardarRequerimiento = async () => {
    // Guardar búsquedas requiere sesión: el listado es público
    const userId = payload?._id || profile?._id || idDesdeToken();
    if (!userId) {
      navigate("/login");
      return;
    }
    if (!hayFiltros()) {
      setFeedback({ tipo: "warning", mensaje: "Ingresa tus preferencias de búsqueda antes de guardar." });
      return;
    }
    try {
      await addRequest({
        userId,
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
        title: `Búsqueda${province?.PRO ? ` en ${province.PRO}` : ""}${municipality?.DMUN50 ? ` - ${municipality.DMUN50}` : ""}`,
      });
      setFeedback({ tipo: "success", mensaje: "Búsqueda guardada. La verás en la pestaña Mis búsquedas." });
    } catch (error) {
      console.error(error);
      setFeedback({ tipo: "error", mensaje: "No se pudo guardar la búsqueda." });
    }
  };

  return (

    <Box sx={{
      // Panel compacto: controles más pequeños y menos aire vertical para
      // que todos los filtros quepan de un vistazo
      display: 'flex',
      flexDirection: 'column',
      // minHeight (no height): el contenido puede crecer y el pie sticky
      // se mantiene visible mientras se hace scroll
      minHeight: '100%',
      // Espaciado uniforme: mismo margen entre campos y con los divisores.
      // El padding superior alinea "Ubicación" con los títulos de los tabs
      pt: 3,
      '& h3': { m: '10px 0 6px 16px', fontSize: 15 },
      '& .MuiFormControl-root': { my: 0.75, display: 'flex' }, // flex (no inline): elimina el hueco de línea entre selects apilados
      '& .MuiDivider-root': { mt: 1.5 },
      '& .MuiInputBase-root': { fontSize: 14 },
      '& .MuiFormControlLabel-root': { my: '-4px' },
      '& .MuiCheckbox-root': { py: '4px' },
    }}>
      {/* Cerrar el drawer: solo tiene sentido en móvil, donde es deslizable */}
      {props.onClose && (
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          backgroundColor: '#ffffff',
          display: { xs: 'flex', sm: 'none' },
          py: 0.5,
          px: 1,
          borderBottom: '1px solid #eee',
          justifyContent: 'space-between',
        }}>
          <IconButton aria-label="Limpiar filtros" onClick={resetFilters} size="small" color="primary">
            <FilterAltOffIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Cerrar filtros" onClick={props.onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Limpiar filtros: flotante SOLO en el panel de escritorio. El drawer
          móvil tiene su botón en la barra; si ambos renderizaran el Fab fijo,
          el del drawer cerrado (inerte) taparía al visible y robaría los clics */}
      {!props.onClose && <Fab
        size="small"
        color="primary"
        aria-label="Limpiar filtros"
        onClick={resetFilters}
        sx={{ position: 'fixed', top: 72, left: 265, zIndex: 3, display: { xs: 'none', sm: 'flex' } }}
      >
        <FilterAltOffIcon fontSize="small" />
      </Fab>}

      <Snackbar open={!!feedback} autoHideDuration={4000} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={feedback?.tipo || "success"} onClose={() => setFeedback(null)}>{feedback?.mensaje}</Alert>
      </Snackbar>

      <h3>Ubicación</h3>
      <LocationFilter />
      <Divider />
      <h3>Precio</h3>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PriceFilterMin />
        <PriceFilterMax />
      </Box>
      <Divider />
      <h3>M²</h3>
      <SquareMeters />
      <Divider />
      <h3>Caracteristicas</h3>
      <RoomFilter />
      <BathFilter />
      <GaragesFilter />
      <Divider />
      <h3>Equipamiento</h3>
      <CheckboxesFilters />

      {/* Botón fijo al pie del panel */}
      <Box sx={{
        position: 'sticky',
        bottom: 0,
        zIndex: 2,
        mt: 'auto',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #eee',
        p: 1.5,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Button fullWidth variant="contained" color="primary" onClick={guardarRequerimiento}>
          Guardar Búsqueda
        </Button>
      </Box>
    </Box>

  )
}

export default Filters;
