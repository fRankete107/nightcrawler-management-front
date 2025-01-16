import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true
});

// Interceptor para agregar el token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en interceptor:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // Solo redirigir si no estamos ya en /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const timerService = {
  createTimer: (data: { empleadoId: number, descripcion: string }) => 
    api.post('/timers', data),
  
  updateTimer: (id: number, data: { fechaFin: string }) =>
    api.put(`/timers/stop`, data),
    
  getTimersByEmpleado: (empleadoId: number) =>
    api.get(`/timers/empleado/${empleadoId}`),
  
  getActiveTimer: () => 
    api.get('/timers/active'),
};

export default api; 