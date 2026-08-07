import { Box, Button, Divider, Fab, IconButton, Snackbar, Alert, Toolbar, Tooltip } from "@mui/material";
import { BathFilter, LocationFilter, PriceFilterMin, SquareMeters, RoomFilter, GaragesFilter, CheckboxesFilters, PriceFilterMax, TransactionFilter } from "../../FilterHousing";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import CloseIcon from '@mui/icons-material/Close';
import HousingContextFilter from "../../FilterHousing/HousingContextFilter";
import { AuthContext } from "../../Contexts/AuthContext";
import { addRequest } from "../../apiService/apiService";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function Filters(props) {
  const { t } = useTranslation('ui');

  const { resetFilters, transaction, room, baths, meter, garage, minPrice, maxPrice, checkbox, location, radius } = useContext(HousingContextFilter);
  const { payload, profile } = useContext(AuthContext);
  const [feedback, setFeedback] = useState(null); // { tipo, mensaje }
  const navigate = useNavigate();

  // The user id may come from the payload, the profile, or the raw token
  // when contexts have not loaded yet (e.g. right after logging in)
  const idDesdeToken = () => {
    try {
      const token = localStorage.getItem('token');
      return token ? JSON.parse(atob(token.split('.')[1]))._id : null;
    } catch { return null; }
  };

  const hayFiltros = () =>
    transaction?.length || location ||
    minPrice || maxPrice || room || baths || garage || Number(meter) > 0 ||
    Object.values(checkbox).some(Boolean);

  const guardarRequerimiento = async () => {
    // Saving searches requires a session; browsing stays public
    const userId = payload?._id || profile?._id || idDesdeToken();
    if (!userId) {
      navigate("/login");
      return;
    }
    if (!hayFiltros()) {
      setFeedback({ tipo: "warning", mensaje: t('searchEmpty') });
      return;
    }
    try {
      await addRequest({
        userId,
        transaction: transaction?.[0] || "sale",
        community: {},
        location: location ? { name: location.name, lat: location.lat, lng: location.lng } : {},
        radius: location ? radius : undefined,
        minM2: Number(meter) || 0,
        minPrice: Number(minPrice) || 0,
        maxPrice: Number(maxPrice) || 0,
        rooms: Number(room) || 1,
        baths: Number(baths) || undefined,
        garages: Number(garage) || undefined,
        currency: "EUR",
        // Model field names differ from the checkbox state keys
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
        title: `Búsqueda${location?.name ? ` en ${location.name}` : ""}`,
      });
      setFeedback({ tipo: "success", mensaje: t('searchSaved') });
    } catch (error) {
      console.error(error);
      setFeedback({ tipo: "error", mensaje: t('searchSaveError') });
    }
  };

  return (

    <Box sx={{
      // Compact panel: smaller controls so every filter fits at a glance
      display: 'flex',
      flexDirection: 'column',
      // minHeight (not height) lets the content grow while the sticky
      // footer button stays visible during scroll
      minHeight: '100%',
      // Uniform spacing between fields and section dividers. The top padding
      // aligns the first heading with the tab titles of the main area
      pt: 3,
      '& h3': { m: '10px 0 6px 16px', fontSize: 15 },
      '& .MuiFormControl-root': { my: 0.75, display: 'flex' }, // block-level flex removes the inline line-gap between stacked selects
      '& .MuiDivider-root': { mt: 1.5 },
      '& .MuiInputBase-root': { fontSize: 14 },
      // The notch cut into the outline is sized from the field's own font
      // (14 → 10.5 shrunk), so the label has to shrink from the same 14 or the
      // floated text is wider than its gap and lands on top of the border
      '& .MuiInputLabel-root': { fontSize: 14 },
      '& .MuiFormControlLabel-root': { my: '-4px' },
      '& .MuiCheckbox-root': { py: '4px' },
    }}>
      {/* Close control only exists on mobile, where the drawer slides in */}
      {props.onClose && (
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          backgroundColor: 'background.paper',
          display: { xs: 'flex', sm: 'none' },
          py: 0.5,
          px: 1,
          borderBottom: 1, borderColor: 'divider',
          justifyContent: 'space-between',
        }}>
          <IconButton aria-label={t('clearFilters')} onClick={resetFilters} size="small" sx={{ color: 'text.secondary' }}>
            <FilterAltOffIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label={t('closeFilters')} onClick={props.onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Floating clear control for the desktop panel only. The mobile drawer
          has its own button in the top bar; rendering both fixed controls
          would stack them and swallow clicks from the visible one */}
      {!props.onClose && <Tooltip title="Limpiar filtros" arrow>
        <IconButton
          size="small"
          aria-label={t('clearFilters')}
          onClick={resetFilters}
          sx={{ position: 'fixed', top: 74, left: 280, zIndex: 3, color: 'text.secondary' }}
        >
          <FilterAltOffIcon fontSize="small" />
        </IconButton>
      </Tooltip>}

      <Snackbar open={!!feedback} autoHideDuration={4000} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={feedback?.tipo || "success"} onClose={() => setFeedback(null)}>{feedback?.mensaje}</Alert>
      </Snackbar>

      <h3>{t('operation')}</h3>
      <TransactionFilter />
      <Divider />
      <h3>{t('location')}</h3>
      <LocationFilter />
      <Divider />
      <h3>{t('price')}</h3>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PriceFilterMin />
        <PriceFilterMax />
      </Box>
      <Divider />
      <h3>{t('features')}</h3>
      <SquareMeters />
      <RoomFilter />
      <BathFilter />
      <GaragesFilter />
      <Divider />
      <h3>{t('equipment')}</h3>
      <CheckboxesFilters />

      {/* Sticky action pinned to the bottom of the panel */}
      <Box sx={{
        position: 'sticky',
        bottom: 0,
        zIndex: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: 1, borderColor: 'divider',
        p: 1.5,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Button fullWidth variant="contained" color="primary" onClick={guardarRequerimiento}>
          {t('saveSearch')}
        </Button>
      </Box>
    </Box>

  )
}

export default Filters;
