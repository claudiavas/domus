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

export function filtraViviendas(housing, filtros) {
  const {
    transaction, meter, room, baths, garage, minPrice, maxPrice, checkbox,
    location, radius,
  } = filtros;

  return (housing || []).filter((house) => {
    const operacion = transaction?.length ? transaction.includes(house.transaction) : true;
    const habitaciones = room ? house.rooms >= parseInt(room) : true;
    const metros = house.squareMeters >= meter;
    const banos = baths ? house.baths >= parseInt(baths) : true;
    const garaje = garage ? house.garages >= parseInt(garage) : true;
    const precioMin = minPrice ? house.price >= Number(minPrice) : true;
    const precioMax = maxPrice ? house.price <= Number(maxPrice) : true;
    // Model field names differ from the checkbox state keys
    const equipamiento = (!checkbox.closet || house.closets) &&
      (!checkbox.air_condicioned || house.airConditioned) &&
      (!checkbox.heating || house.heating) &&
      (!checkbox.elevator || house.elevator) &&
      (!checkbox.outside_view || house.outsideView) &&
      (!checkbox.garden || house.garden) &&
      (!checkbox.pool || house.pool) &&
      (!checkbox.terrace || house.terrace) &&
      (!checkbox.storage || house.storage) &&
      (!checkbox.accessible || house.accessible);
    // Radius search: listings without coordinates cannot match a located search
    const zona = !location ||
      (house.coordinates?.lat != null && house.coordinates?.lng != null &&
        haversineKm(location, house.coordinates) <= (radius || 25));

    return operacion && habitaciones && metros && banos && garaje && precioMin && precioMax &&
      equipamiento && zona;
  });
}

/**
 * Match percentage between a property and the active criteria
 * (100 when no criteria are set). Used by the relevance sort, which scores
 * every listing instead of excluding them.
 *
 * Numeric criteria award partial credit the closer the property gets to the
 * requested value: asking for 2 bathrooms and finding 1 scores 0.5 for that
 * criterion instead of failing it outright. Location earns full credit inside
 * the chosen radius and decays with distance beyond it, so a property 40 km
 * from a 25 km search still gets part of the location credit.
 * The operation filter (buy/rent/vacation) is exclusive by nature and never
 * takes part in the score.
 */
export function puntuaRelevancia(house, filtros) {
  const {
    meter, room, baths, garage, minPrice, maxPrice, checkbox,
    location, radius,
  } = filtros;

  const puntos = [];
  const ratio = (real, pedido) => Math.max(0, Math.min(1, (real || 0) / pedido));

  if (room) puntos.push(ratio(house.rooms, parseInt(room)));
  if (baths) puntos.push(ratio(house.baths, parseInt(baths)));
  if (garage) puntos.push(ratio(house.garages, parseInt(garage)));
  if (Number(meter) > 0) puntos.push(ratio(house.squareMeters, Number(meter)));
  if (minPrice) puntos.push(house.price >= Number(minPrice) ? 1 : house.price / Number(minPrice));
  if (maxPrice) puntos.push(house.price <= Number(maxPrice) ? 1 : Number(maxPrice) / house.price);

  // Distance credit: 1 inside the radius, then inversely proportional to the
  // distance (twice the radius scores 0.5). No coordinates means no credit.
  if (location) {
    const r = radius || 25;
    if (house.coordinates?.lat != null && house.coordinates?.lng != null) {
      const d = haversineKm(location, house.coordinates);
      puntos.push(d <= r ? 1 : Math.min(1, r / d));
    } else {
      puntos.push(0);
    }
  }

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
