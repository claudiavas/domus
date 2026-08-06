import React, { createContext, useContext, useState, useEffect } from 'react';
import { getActiveHousing, updateHousing } from '../apiService/apiService';

export const HousingContext = createContext();

export const HousingProvider = ({ children }) => {
    const [housing, setHousing] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHousing = async () => {
      try {
        const data = await getActiveHousing();
        // Garantizar array: una respuesta de error del backend no debe romper los .filter()
        setHousing(Array.isArray(data) ? data : []);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }

  useEffect(() => {
    fetchHousing();
  }, [housing]);  

  // useEffect(() => {
  // }, [housing]);
  
  

  const contextValue = {
    housing,
    setHousing,
    isLoading,
  };

  // Always render the app; each view decides how to present its loading state
  return (
    <HousingContext.Provider value={contextValue}>
      {children}
    </HousingContext.Provider>
  );
};