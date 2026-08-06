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
    const prov = province ? (house.province?.CPRO === province.CPRO) : true;
    const muni = municipality ? (house.municipality?.CMUM === municipality.CMUM) : true;
    const barrio = neighborhood ? (house.neighborhood?.NNUCLE50 === neighborhood.NNUCLE50) : true;
    const poblacion = population ? (house.population?.CUN === population.CUN) : true;

    return operacion && habitaciones && metros && banos && garaje && precioMin && precioMax &&
      equipamiento && prov && muni && barrio && poblacion;
  });
}

/**
 * Match percentage between a property and the active criteria
 * (100 when no criteria are set). Used by the relevance sort, which scores
 * every listing instead of excluding them.
 *
 * Numeric criteria award partial credit the closer the property gets to the
 * requested value: asking for 2 bathrooms and finding 1 scores 0.5 for that
 * criterion instead of failing it outright. Location is scored by hierarchy
 * (province → municipality → town → neighbourhood), so a property in the same
 * province but a different town still earns part of the location credit.
 * The operation filter (buy/rent/vacation) is exclusive by nature and never
 * takes part in the score.
 */
export function puntuaRelevancia(house, filtros) {
  const {
    meter, room, baths, garage, minPrice, maxPrice, checkbox,
    province, municipality, neighborhood, population,
  } = filtros;

  const puntos = [];
  const ratio = (real, pedido) => Math.max(0, Math.min(1, (real || 0) / pedido));

  if (room) puntos.push(ratio(house.rooms, parseInt(room)));
  if (baths) puntos.push(ratio(house.baths, parseInt(baths)));
  if (garage) puntos.push(ratio(house.garages, parseInt(garage)));
  if (Number(meter) > 0) puntos.push(ratio(house.squareMeters, Number(meter)));
  if (minPrice) puntos.push(house.price >= Number(minPrice) ? 1 : house.price / Number(minPrice));
  if (maxPrice) puntos.push(house.price <= Number(maxPrice) ? 1 : Number(maxPrice) / house.price);

  // Hierarchical location credit: deeper levels only count while their
  // parents match, so a same-named town in another province earns nothing
  const niveles = [
    [province, () => house.province?.CPRO === province.CPRO],
    [municipality, () => house.municipality?.CMUM === municipality.CMUM],
    [population, () => house.population?.CUN === population.CUN],
    [neighborhood, () => house.neighborhood?.NNUCLE50 === neighborhood.NNUCLE50],
  ].filter(([sel]) => Boolean(sel));
  if (niveles.length) {
    let acertados = 0;
    for (const [, coincide] of niveles) {
      if (coincide()) acertados++;
      else break;
    }
    puntos.push(acertados / niveles.length);
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
