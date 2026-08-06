import React, { createContext, useState } from 'react';

const HousingContextFilter = createContext();

export function InmueblesProvider({ children }) {
  const [transaction, setTransaction] = useState('');
  const [room, setRoom] = useState('');
  const [baths, setBaths] = useState('');
  const [meter, setMeter] = useState(0); // no minimum by default
  const [garage, setGarage] = useState ('');
  const [minPrice, setMinPrice] = useState ('');
  const [maxPrice, setMaxPrice] = useState (''); // no ceiling by default, mirroring the minimum
  const [checkbox, setCheckbox] = useState({
    closet: false,
    air_condicioned: false,
    heating: false,
    elevator: false,
    outside_view: false,
    garden: false,
    pool: false,
    terrace: false,
    storage: false,
    accessible: false,
  });
  const [province, setProvince] = useState();
  const [municipality, setMunicipality] = useState();
  const [neighborhood, setNeighborhood] = useState();
  const [population, setPopulation] = useState();

  const resetFilters = () => {
    setTransaction('');
    setMeter(0);
    setRoom('');
    setBaths('');
    setGarage('');
    setMinPrice('');
    setMaxPrice('');
    setCheckbox({
      closet: false,
      air_condicioned: false,
      heating: false,
      elevator: false,
      outside_view: false,
      garden: false,
      pool: false,
      terrace: false,
      storage: false,
      accessible: false,
    });
    setProvince(undefined);
    setMunicipality(undefined);
    setNeighborhood(undefined);
    setPopulation(undefined);
  };

  const value = {
    meter,
    setMeter,
    room,
    setRoom,
    resetFilters,
    baths,
    setBaths,
    garage,
    setGarage,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    checkbox,
    setCheckbox,
    province,
    setProvince,
    municipality,
    setMunicipality,
    neighborhood,
    setNeighborhood,
    population,
    setPopulation,
  };
  return (
    <HousingContextFilter.Provider value={{ transaction, setTransaction, room, setRoom, baths, setBaths, meter, setMeter, garage, setGarage, minPrice, setMinPrice, maxPrice, setMaxPrice, checkbox, setCheckbox, province, setProvince, municipality, setMunicipality, neighborhood, setNeighborhood, population, setPopulation, resetFilters }}>
      {children}
    </HousingContextFilter.Provider>
  );
}

export default HousingContextFilter;

