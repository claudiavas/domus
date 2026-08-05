import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DOMUS_GREEN } from '../../../theme';

const pinDomus = L.divIcon({
  className: '',
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:${DOMUS_GREEN};transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

// Leaflet calcula mal el tamaño si el contenedor estaba oculto (diálogos,
// carruseles): reintentar invalidateSize unos instantes tras montar
function AjustarTamano() {
  const map = useMap();
  useEffect(() => {
    const timers = [100, 400, 900, 1800].map((ms) => setTimeout(() => map.invalidateSize(), ms));
    // recalcular cuando el contenedor se hace visible (diálogos, carrusel)
    // o cambia de tamaño: si no, el mapa se pinta parcialmente
    const el = map.getContainer();
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) map.invalidateSize();
    });
    io.observe(el);
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el);
    return () => { timers.forEach(clearTimeout); io.disconnect(); ro.disconnect(); };
  }, [map]);
  return null;
}

export function MiniMapa({ lat, lng, zoom = 14, height = '100%' }) {
  if (!lat || !lng) return null;
  return (
    <MapContainer center={[lat, lng]} zoom={zoom} style={{ height, width: '100%' }} scrollWheelZoom={false}>
      <AjustarTamano />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={pinDomus} />
    </MapContainer>
  );
}
