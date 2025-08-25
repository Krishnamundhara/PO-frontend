import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (via token in localStorage)
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set axios default headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data from token (could be a separate API endpoint)
          const userData = JSON.parse(localStorage.getItem('user'));
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error during auth initialization:', error);
          // Clear invalid tokens
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      console.log('Attempting login with username:', username);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      console.log('Using API URL:', `${apiUrl}/auth/login`);
      
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username,
        password
      });
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        console.error('Invalid response format - missing token or user data');
        return { 
          success: false, 
          message: 'Server returned an invalid response. Please try again.' 
        };
      }
      
      console.log('Login successful for user:', user.username);
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide more specific error messages based on the error type
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Error response data:', error.response.data);
        return { 
          success: false, 
          message: error.response.data.message || `Login failed (${error.response.status})` 
        };
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server');
        return {
          success: false,
          message: 'No response from server. Please check your connection.'
        };
      } else {
        // Something else happened in setting up the request
        return { 
          success: false, 
          message: error.message || 'An unexpected error occurred' 
        };
      }
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
