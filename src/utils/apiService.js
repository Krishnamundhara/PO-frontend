import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to inject token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle backend cold starts (connection refused, timeout, network error)
    if (
      !error.response || 
      error.code === 'ECONNABORTED' || 
      error.message === 'Network Error' ||
      error.message.includes('timeout')
    ) {
      console.log('Backend might be waking up from sleep, checking...');
      const originalRequest = error.config;
      
      // Only retry once to avoid infinite loops
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        // Check if backend is actually sleeping by pinging the health endpoint
        return new Promise((resolve) => {
          const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
          
          // First try to ping health endpoint with a short timeout
          fetch(`${API_URL}/health`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(2000) // Short timeout to quickly determine if awake
          })
          .then(response => {
            if (response.ok) {
              // Backend is actually awake, just retry the original request
              console.log('Backend is awake, just retrying request');
              resolve(api(originalRequest));
            } else {
              throw new Error('Backend returned error');
            }
          })
          .catch(err => {
            // Backend is likely sleeping, show notification and wait longer
            console.log('Backend is sleeping, showing notification and waiting', err);
            if (window.wakeupNotification) {
              window.wakeupNotification();
            }
            
            // Wait longer before retrying since backend needs to wake up
            setTimeout(() => {
              resolve(api(originalRequest));
            }, 5000);
          });
        });
      }
    }
    
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Auth methods
  login: (credentials) => api.post('/auth/login', credentials),
  
  // User methods
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  resetPassword: (id, passwordData) => api.post(`/users/${id}/reset-password`, passwordData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Purchase Order methods
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  
  // Company Profile methods
  getCompanyProfile: () => api.get('/company'),
  updateCompanyProfile: (formData) => api.post('/company', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

export default apiService;
