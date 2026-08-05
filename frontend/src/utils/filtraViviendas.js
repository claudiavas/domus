// Filtro de viviendas compartido entre el listado y el mapa.
// Recibe el array de viviendas y el objeto del HousingContextFilter.
export function filtraViviendas(housing, filtros) {
  const {
    meter, room, baths, garage, minPrice, maxPrice, checkbox,
    province, municipality, neighborhood, population,
  } = filtros;

  return (housing || []).filter((house) => {
    const habitaciones = room ? house.rooms >= parseInt(room) : true;
    const metros = house.squareMeters >= meter;
    const banos = baths ? house.baths >= parseInt(baths) : true;
    const garaje = garage ? house.garages >= parseInt(garage) : true;
    const precioMin = minPrice ? house.price >= Number(minPrice) : true;
    const precioMax = maxPrice ? house.price <= Number(maxPrice) : true;
    // Los nombres del modelo difieren de los del estado de checkboxes
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

    return habitaciones && metros && banos && garaje && precioMin && precioMax &&
      equipamiento && prov && muni && barrio && poblacion;
  });
}
