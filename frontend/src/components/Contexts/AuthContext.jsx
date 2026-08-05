import React, { createContext, useState, useEffect } from 'react';
import { getProfile } from '../apiService/apiService';
import { getPayload } from '../apiService/apiService';
import {Login} from '../Authentication/Login';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [payload, setPayload] = useState({})
  const [profile, setProfile] = useState({})
  

  const fetchPayload = async (token) => {
    try {
      const response = await getPayload(token)
      setPayload(response.data)
    } catch (error) {
      console.log("error", error)
    }
  }

  const fetchProfile = async (payload) => {
    try {
      if (payload && payload._id) {
        const response = await getProfile(payload._id);
        setProfile(response);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
   
   // Verificar si el usuario tiene un token en el localStorage
   useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log("token", token);
    if (token) {
      setIsLoggedIn(true);
      fetchPayload(token)
    }
  }, []);

  useEffect(() => {
    // console.log("payload", payload)
    fetchProfile(payload);
    console.log("isLoggedIn", isLoggedIn)
  }, [payload]);

  // Al cerrar sesión hay que vaciar payload y profile: si no, el avatar
  // y los datos del usuario siguen visibles aunque ya no haya token.
  // Al iniciar sesión (SPA, sin recargar la página) hay que cargar el
  // payload: el useEffect de montaje ya corrió sin token
  useEffect(() => {
    if (!isLoggedIn) {
      setPayload({});
      setProfile({});
    } else {
      const token = localStorage.getItem('token');
      if (token) fetchPayload(token);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // console.log("profile", profile)
  }, [profile]);


  useEffect(() => {
    setChecking(false);
  }, []);


  const contextValue = {
    isLoggedIn,
    setIsLoggedIn,
    checking,
    profile,
    payload
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};