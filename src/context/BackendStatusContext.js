import React, { createContext, useState, useContext, useEffect } from 'react';

const BackendStatusContext = createContext();

export const useBackendStatus = () => useContext(BackendStatusContext);

export const BackendStatusProvider = ({ children }) => {
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [wakeupStartTime, setWakeupStartTime] = useState(null);
  const [lastAwakeTime, setLastAwakeTime] = useState(null);

  useEffect(() => {
    // Register global function to notify when backend is waking up
    window.wakeupNotification = () => {
      // Only show wakeup notification if we haven't confirmed backend is awake recently
      const isRecentlyAwake = lastAwakeTime && (Date.now() - lastAwakeTime < 5 * 60 * 1000); // 5 minutes
      
      if (!isRecentlyAwake) {
        console.log('Showing wake-up notification');
        setIsWakingUp(true);
        setWakeupStartTime(Date.now());
      } else {
        console.log('Backend was recently confirmed awake, not showing notification');
      }
    };

    // Check if backend is awake on initial load
    const pingBackend = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        
        // Just fetch the options, don't need actual data
        const response = await fetch(`${API_URL}/health`, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        
        if (response.ok) {
          // Backend is confirmed awake
          console.log('Backend is confirmed awake');
          setIsWakingUp(false);
          setLastAwakeTime(Date.now());
          localStorage.setItem('lastBackendAwakeTime', Date.now().toString());
        }
      } catch (error) {
        // Only show wake-up if recent confirmed awake time not found
        const storedLastAwakeTime = localStorage.getItem('lastBackendAwakeTime');
        const isRecentlyAwake = storedLastAwakeTime && 
          (Date.now() - parseInt(storedLastAwakeTime) < 5 * 60 * 1000); // 5 minutes
          
        if (!isRecentlyAwake) {
          console.log('Backend may be sleeping, showing wake-up notification');
          setIsWakingUp(true);
          setWakeupStartTime(Date.now());
        } else {
          console.log('Backend was recently awake, not showing notification yet');
        }
      }
    };

    pingBackend();

    // Clear wakeup state and check backend status periodically
    const intervalId = setInterval(() => {
      // If been waking up for more than 45 seconds, check if it's actually awake now
      if (isWakingUp && wakeupStartTime && Date.now() - wakeupStartTime > 45000) {
        pingBackend();
      }
      
      // If been waking up for more than 60 seconds, just hide the notification regardless
      if (isWakingUp && wakeupStartTime && Date.now() - wakeupStartTime > 60000) {
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
