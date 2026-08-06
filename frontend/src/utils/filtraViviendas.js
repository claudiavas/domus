/**
 * Shared listing filter used by both the list view and the map view.
 * Receives the housing array and the filter context values.
 */
export function filtraViviendas(housing, filtros) {
  const {
    transaction, meter, room, baths, garage, minPrice, maxPrice, checkbox,
    province, municipality, neighborhood, population,
  } = filtros;

  return (housing || []).filter((house) => {
    const operacion = transaction ? house.transaction === transaction : true;
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
    const prov = province ? (house.province?.CPRO === province.CPRO) : true;
    const muni = municipality ? (house.municipality?.CMUM === municipality.CMUM) : true;
    const barrio = neighborhood ? (house.neighborhood?.NNUCLE50 === neighborhood.NNUCLE50) : true;
    const poblacion = population ? (house.population?.CUN === population.CUN) : true;

    return operacion && habitaciones && metros && banos && garaje && precioMin && precioMax &&
      equipamiento && prov && muni && barrio && poblacion;
  });
}

/**
 * Percentage of the active criteria satisfied by a property
 * (100 when no criteria are set). Used by the relevance sort,
 * which scores every listing instead of excluding them.
 */
export function puntuaRelevancia(house, filtros) {
  const {
    transaction, meter, room, baths, garage, minPrice, maxPrice, checkbox,
    province, municipality, neighborhood, population,
  } = filtros;

  const criterios = [];
  if (transaction) criterios.push(house.transaction === transaction);
  if (room) criterios.push(house.rooms >= parseInt(room));
  if (Number(meter) > 0) criterios.push(house.squareMeters >= meter);
  if (baths) criterios.push(house.baths >= parseInt(baths));
  if (garage) criterios.push(house.garages >= parseInt(garage));
  if (minPrice) criterios.push(house.price >= Number(minPrice));
  if (maxPrice) criterios.push(house.price <= Number(maxPrice));
  if (province) criterios.push(house.province?.CPRO === province.CPRO);
  if (municipality) criterios.push(house.municipality?.CMUM === municipality.CMUM);
  if (population) criterios.push(house.population?.CUN === population.CUN);
  if (neighborhood) criterios.push(house.neighborhood?.NNUCLE50 === neighborhood.NNUCLE50);
  const equipos = [
    ['closet', 'closets'], ['air_condicioned', 'airConditioned'], ['heating', 'heating'],
    ['elevator', 'elevator'], ['outside_view', 'outsideView'], ['garden', 'garden'],
    ['pool', 'pool'], ['terrace', 'terrace'], ['storage', 'storage'], ['accessible', 'accessible'],
  ];
  for (const [filtro, campo] of equipos) {
    if (checkbox[filtro]) criterios.push(Boolean(house[campo]));
  }

  if (!criterios.length) return 100;
  return Math.round((criterios.filter(Boolean).length / criterios.length) * 100);
}
