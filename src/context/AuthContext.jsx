import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService, { getStoredUser, setStoredUser, removeStoredUser } from '../services/authService';
import { getAuthToken, removeAuthToken } from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and restore auth state on browser refresh
  const initAuth = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }

    try {
      // Refresh current user info from backend if session is valid
      const currentUser = await authService.getCurrentUser();
      const userData = currentUser.user || currentUser;
      setUser(userData);
      setIsAuthenticated(true);
      setStoredUser(userData);
    } catch (err) {
      // If server returns 401 or token is invalid, clean up state
      if (err.status === 401 || err.status === 403) {
        removeAuthToken();
        removeStoredUser();
        setUser(null);
        setIsAuthenticated(false);
      } else if (storedUser) {
        // If offline / network error, retain cached user session
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  /**
   * Login handler
   * @param {Object} credentials { email, password, rememberMe }
   */
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      
      let userData = res.user || res.data?.user || res.userInfo || null;
      
      // If user details were not returned in login payload, fetch /me
      if (!userData) {
        try {
          const meRes = await authService.getCurrentUser();
          userData = meRes.user || meRes;
        } catch (meErr) {
          userData = { email: credentials.email };
        }
      }

      setUser(userData);
      setIsAuthenticated(true);
      setStoredUser(userData, credentials.rememberMe !== false);
      return res;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout handler
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth: initAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
