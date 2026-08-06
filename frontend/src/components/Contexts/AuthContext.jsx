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
      console.error(error);
    }
  }

  const fetchProfile = async (payload) => {
    try {
      if (payload && payload._id) {
        const response = await getProfile(payload._id);
        setProfile(response);
      }
    } catch (error) {
      console.error(error);
    }
  };
   
   // Restore the session when a token is present in localStorage
   useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchPayload(token)
    }
  }, []);

  useEffect(() => {
    fetchProfile(payload);
  }, [payload]);

  // Clearing the session must also reset payload and profile, otherwise
  // the avatar keeps showing after logout. Logging in happens client-side
  // (no page reload), so the payload is fetched again when the flag flips
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