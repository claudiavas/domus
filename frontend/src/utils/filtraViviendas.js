/**
 * Shared listing filter used by both the list view and the map view.
 * Receives the housing array and the filter context values.
 */

/**
 * Great-circle distance in kilometres between two {lat, lng} points
 * (Haversine formula). Good enough for radius search at city scale.
 */
export function haversineKm(a, b) {
  const R = 6371;
  const rad = (deg) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Only the operation (buy / rent / vacation) excludes a listing outright: a
 * flat for sale is never an answer to a rental search. Every other criterion,
 * including the location radius, is a preference, not a requirement — those
 * listings stay in the results and lose match percentage instead, see
 * puntuaRelevancia. A house 500m past the radius still shows up, just with a
 * lower score than one right at the search centre.
 */
export function filtraViviendas(housing, filtros) {
  const { transaction } = filtros;

  return (housing || []).filter((house) => {
    const operacion = transaction?.length ? transaction.includes(house.transaction) : true;

    return operacion;
  });
}

/**
 * Match percentage between a property and the active criteria
 * (100 when no criteria are set). Used by the relevance sort, which scores
 * every listing instead of excluding them.
 *
 * Numeric criteria award partial credit the closer the property gets to the
 * requested value: asking for 2 bathrooms and finding 1 scores 0.5 for that
 * criterion instead of failing it outright.
 * Operation does not take part in the score: it is an exclusive filter, so
 * every scored listing already satisfies it and adding a constant 1 would
 * only dilute the average. Location does take part: it scores 1 inside the
 * radius and decays the further past it a listing sits.
 */
export function puntuaRelevancia(house, filtros) {
  const {
    meter, room, baths, garage, minPrice, maxPrice, checkbox, location, radius,
  } = filtros;

  const puntos = [];
  const ratio = (real, pedido) => Math.max(0, Math.min(1, (real || 0) / pedido));

  if (location) {
    if (house.coordinates?.lat != null && house.coordinates?.lng != null) {
      const distancia = haversineKm(location, house.coordinates);
      const radioKm = radius || 25;
      puntos.push(distancia <= radioKm ? 1 : radioKm / distancia);
    } else {
      puntos.push(0);
    }
  }

  if (room) puntos.push(ratio(house.rooms, parseInt(room)));
  if (baths) puntos.push(ratio(house.baths, parseInt(baths)));
  if (garage) puntos.push(ratio(house.garages, parseInt(garage)));
  if (Number(meter) > 0) puntos.push(ratio(house.squareMeters, Number(meter)));
  if (minPrice) puntos.push(house.price >= Number(minPrice) ? 1 : house.price / Number(minPrice));
  if (maxPrice) puntos.push(house.price <= Number(maxPrice) ? 1 : Number(maxPrice) / house.price);

  // Amenities stay binary: a pool is either there or it is not
  const equipos = [
    ['closet', 'closets'], ['air_condicioned', 'airConditioned'], ['heating', 'heating'],
    ['elevator', 'elevator'], ['outside_view', 'outsideView'], ['garden', 'garden'],
    ['pool', 'pool'], ['terrace', 'terrace'], ['storage', 'storage'], ['accessible', 'accessible'],
  ];
  for (const [filtro, campo] of equipos) {
    if (checkbox[filtro]) puntos.push(house[campo] ? 1 : 0);
  }

  if (!puntos.length) return 100;
  const media = puntos.reduce((a, b) => a + b, 0) / puntos.length;
  return Math.round(media * 100);
}
