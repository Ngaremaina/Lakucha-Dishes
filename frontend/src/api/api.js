import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://lakucha-dishes-0zbz.onrender.com', // Change this to your backend URL
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // If you are using cookies
});

// Optional: Add interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
