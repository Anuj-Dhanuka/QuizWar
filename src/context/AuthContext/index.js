import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const storeUserIdandTokenInContext = (userId, token) => {
    setUser({ userId, token });
  };

  const removeUserIdandTokenFromContext = () => {
    setUser(null);
  };

  const getUserIdFromStorage = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");
      if (userId !== null) {
        setUser({ userId, userToken });
      }
    } catch (e) {
      console.log("Failed to fetch userToken and userId from AsyncStorage context", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserIdFromStorage();
  }, []);

  const value = {
    user,
    loading, // Provide loading state
    storeUserIdandTokenInContext,
    removeUserIdandTokenFromContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
