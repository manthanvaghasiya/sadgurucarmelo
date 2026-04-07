import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to attach the JWT token to requests if it exists in localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle 401 Unauthorized responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear session data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Notify user
      toast.error('Your session expired for security reasons. Please log in again.');
      
      // Redirect
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
