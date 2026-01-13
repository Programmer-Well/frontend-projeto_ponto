import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000, 
});

api.interceptors.request.use(
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

export const checkBackendStatus = async () => {
  try {
    await api.get('/health');
    console.log('✅ Backend connection is OK.');
    return { isOnline: true };
  } catch (error) {
    console.error('❌ Backend is offline or unreachable.', error.message);
    return { isOnline: false, error };
  }
};

export default api;