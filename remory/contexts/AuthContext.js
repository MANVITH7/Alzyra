import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthService from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userAttributes, setUserAttributes] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setLoading(true);
      const currentUser = await AuthService.getCurrentAuthUser();

      if (currentUser) {
        setUser(currentUser.user);
        setUserAttributes(currentUser.attributes);
        setTokens({
          idToken: currentUser.idToken,
          accessToken: currentUser.accessToken,
        });
        setIsAuthenticated(true);

        // Store tokens in AsyncStorage for offline access
        await AsyncStorage.setItem('userTokens', JSON.stringify({
          idToken: currentUser.idToken,
          accessToken: currentUser.accessToken,
        }));
        await AsyncStorage.setItem('userAttributes', JSON.stringify(currentUser.attributes));
      }
    } catch (error) {
      console.log('No authenticated user found:', error.message);
      setIsAuthenticated(false);
      // Clear any stored data
      await AsyncStorage.removeItem('userTokens');
      await AsyncStorage.removeItem('userAttributes');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, attributes = {}) => {
    try {
      const result = await AuthService.signUp(email, password, attributes);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const confirmSignUp = async (email, code) => {
    try {
      const result = await AuthService.confirmSignUp(email, code);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const resendConfirmationCode = async (email) => {
    try {
      const result = await AuthService.resendConfirmationCode(email);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await AuthService.signIn(email, password);

      setUser(result.user);
      setUserAttributes(result.attributes);
      setTokens({
        idToken: result.idToken,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      setIsAuthenticated(true);

      // Store tokens and attributes in AsyncStorage
      await AsyncStorage.setItem('userTokens', JSON.stringify({
        idToken: result.idToken,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }));
      await AsyncStorage.setItem('userAttributes', JSON.stringify(result.attributes));

      return result;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setUserAttributes(null);
      setTokens(null);
      setIsAuthenticated(false);

      // Clear AsyncStorage
      await AsyncStorage.removeItem('userTokens');
      await AsyncStorage.removeItem('userAttributes');
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const result = await AuthService.forgotPassword(email);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const confirmPassword = async (email, code, newPassword) => {
    try {
      const result = await AuthService.confirmPassword(email, code, newPassword);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const result = await AuthService.changePassword(oldPassword, newPassword);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateUserAttributes = async (attributes) => {
    try {
      const result = await AuthService.updateUserAttributes(attributes);
      // Refresh user attributes
      await checkAuthState();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getUserAttribute = (attributeName) => {
    return userAttributes ? userAttributes[attributeName] : null;
  };

  const value = {
    user,
    userAttributes,
    tokens,
    loading,
    isAuthenticated,
    signUp,
    confirmSignUp,
    resendConfirmationCode,
    signIn,
    signOut,
    forgotPassword,
    confirmPassword,
    changePassword,
    updateUserAttributes,
    getUserAttribute,
    checkAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
