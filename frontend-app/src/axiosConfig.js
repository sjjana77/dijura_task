import axios from 'axios';
import { store } from './store'; // Import the store

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add a request interceptor to set the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token; // Get the token from the store
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
