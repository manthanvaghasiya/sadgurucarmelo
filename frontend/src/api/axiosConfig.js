import axios from 'axios';
import toast from 'react-hot-toast';

const cleanEnvUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
const finalBaseURL = cleanEnvUrl 
  ? (cleanEnvUrl.endsWith('/api') ? cleanEnvUrl : `${cleanEnvUrl}/api`)
  : 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: finalBaseURL,
});

// 1. Dynamic Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // MUST be inside the interceptor to get a fresh token on every request!
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

// 2. Auto-Logout Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/'; // Kick them out securely if token is expired/invalid
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
