import React, { createContext, useState } from 'react';

const HousingContextFilter = createContext();

export function InmueblesProvider({ children }) {
  const [transaction, setTransaction] = useState([]);
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
  // Geocoded place picked in the search box: { name, lat, lng } or undefined
  const [location, setLocation] = useState();
  // Search radius in km around the picked place
  const [radius, setRadius] = useState(25);

  const resetFilters = () => {
    setTransaction([]);
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
    setLocation(undefined);
    setRadius(25);
  };

  return (
    <HousingContextFilter.Provider value={{ transaction, setTransaction, room, setRoom, baths, setBaths, meter, setMeter, garage, setGarage, minPrice, setMinPrice, maxPrice, setMaxPrice, checkbox, setCheckbox, location, setLocation, radius, setRadius, resetFilters }}>
      {children}
    </HousingContextFilter.Provider>
  );
}

export default HousingContextFilter;
