import React, { createContext, useState, useContext, useEffect } from 'react';

const BackendStatusContext = createContext();

export const useBackendStatus = () => useContext(BackendStatusContext);

export const BackendStatusProvider = ({ children }) => {
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [wakeupStartTime, setWakeupStartTime] = useState(null);

  useEffect(() => {
    // Register global function to notify when backend is waking up
    window.wakeupNotification = () => {
      setIsWakingUp(true);
      setWakeupStartTime(Date.now());
    };

    // Check if backend is awake on initial load
    const pingBackend = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        // Just fetch the options, don't need actual data
        const response = await fetch(`${API_URL}/health`, { 
          method: 'OPTIONS',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        if (response.ok) {
          setIsWakingUp(false);
        }
      } catch (error) {
        console.log('Backend may be sleeping, showing wake-up notification');
        setIsWakingUp(true);
        setWakeupStartTime(Date.now());
      }
    };

    pingBackend();

    // Clear wakeup state after 30 seconds
    const intervalId = setInterval(() => {
      if (isWakingUp && wakeupStartTime && Date.now() - wakeupStartTime > 30000) {
        setIsWakingUp(false);
        setWakeupStartTime(null);
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
      window.wakeupNotification = null;
    };
  }, [isWakingUp, wakeupStartTime]);

  return (
    <BackendStatusContext.Provider value={{ isWakingUp, setIsWakingUp }}>
      {children}
    </BackendStatusContext.Provider>
  );
};
