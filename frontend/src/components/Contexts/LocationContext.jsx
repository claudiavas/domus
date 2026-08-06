import React, { createContext, useState, useEffect } from 'react';
import { getCommunities, getProvinces } from '../apiService/apiService';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [communities, setCommunities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProvinces = async () => {
    try {
      const data = await getProvinces();
      setProvinces(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCommunities = async () => {
    try {
      const data = await getCommunities();
      setCommunities(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchProvinces(), fetchCommunities()]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const contextValue = {
    provinces,
    communities,
  };

  // Always render the app; the dropdowns simply populate once the
  // provinces arrive (skeletons cover the visual wait)
  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};