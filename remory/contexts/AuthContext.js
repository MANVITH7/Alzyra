import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem('user');

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('No authenticated user found:', error.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Simple sign in (no actual authentication - demo mode)
   */
  const signIn = async (email, password) => {
    try {
      // Simple demo login - just store the email as user
      const userData = {
        email: email,
        name: email.split('@')[0],
        id: Date.now().toString(),
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return {
        user: userData,
        attributes: userData,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error('Failed to sign in');
    }
  };

  /**
   * Simple sign up (no actual authentication - demo mode)
   */
  const signUp = async (email, password, attributes = {}) => {
    try {
      // Simple demo signup - just store the user data
      const userData = {
        email: email,
        name: attributes.name || email.split('@')[0],
        ...attributes,
        id: Date.now().toString(),
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return {
        user: userData,
        userConfirmed: true,
        userSub: userData.id,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error('Failed to sign up');
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  };

  /**
   * Get user attribute
   */
  const getUserAttribute = (attributeName) => {
    return user ? user[attributeName] : null;
  };

  /**
   * Confirm sign up (no-op in demo mode)
   */
  const confirmSignUp = async (email, code) => {
    // No-op in demo mode
    return { success: true };
  };

  /**
   * Resend confirmation code (no-op in demo mode)
   */
  const resendConfirmationCode = async (email) => {
    // No-op in demo mode
    return { success: true };
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    resendConfirmationCode,
    getUserAttribute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
