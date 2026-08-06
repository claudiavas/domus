import { useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HousingContext } from '../../Contexts/HousingContext';
import HousingContextFilter from '../../FilterHousing/HousingContextFilter';
import { filtraViviendas } from '../../../utils/filtraViviendas';
import { DOMUS_GREEN } from '../../../theme';

// Custom marker in the brand colour (avoids bundling Leaflet's default image assets)
const pinDomus = L.divIcon({
  className: '',
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:${DOMUS_GREEN};transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
  popupAnchor: [0, -24],
});

export function HousingMap() {
  const navigate = useNavigate();
  const { housing } = useContext(HousingContext);
  const filtros = useContext(HousingContextFilter);

  const viviendas = filtraViviendas(housing, filtros).filter(
    (h) => h.coordinates?.lat && h.coordinates?.lng
  );

  const formatoPrecio = (h) => {
    const precio = new Intl.NumberFormat('es-ES').format(h.price);
    if (h.transaction === 'rent') return `${precio} €/mes`;
    if (h.transaction === 'vacation_rentals') return `${precio} €/semana`;
    return `${precio} €`;
  };

  return (
    <Box sx={{ height: { xs: 'calc(100vh - 210px)', sm: 'calc(100vh - 220px)' }, borderRadius: 1, overflow: 'hidden' }}>
      <MapContainer center={[40.0, -3.7]} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {viviendas.map((h) => (
          <Marker key={h._id} position={[h.coordinates.lat, h.coordinates.lng]} icon={pinDomus}>
            <Popup>
              <Box sx={{ minWidth: 180 }}>
                {h.images?.[0] && (
                  <img src={h.images[0]} alt="" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 4 }} />
                )}
                <Box sx={{ fontWeight: 600, my: 0.5 }}>{h.title}</Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip size="small" color="primary" label={formatoPrecio(h)} />
                  <Box
                    component="span"
                    onClick={() => navigate(`/housingdetails/${h._id}`)}
                    sx={{ color: 'primary.main', textDecoration: 'underline', cursor: 'pointer', fontSize: 13 }}
                  >
                    Ver más
                  </Box>
                </Box>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
