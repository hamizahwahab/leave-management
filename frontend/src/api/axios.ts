import axios from 'axios';

// 1. Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Your Laravel backend URL
  headers: {
    'Accept': 'application/json',
  },
});

// 2. Request Interceptor: Automatically attach auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (where your AuthContext stores it)
    const token = localStorage.getItem('token'); // Check your AuthContext for exact key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
