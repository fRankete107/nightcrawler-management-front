import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: number;
  nombre: string;
  username: string;
  rol: 'GERENTE' | 'SUPERVISOR' | 'MECANICO';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthResponse {
  token: string;
  empleado: {
    id: number;
    nombre: string;
    username: string;
    nacionalidad: string;
    telefono: string;
    residencia: string;
    fechaIngreso: string;
    cargoActual: string;
    rol: 'GERENTE' | 'SUPERVISOR' | 'MECANICO';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token en localStorage:', token);
    
    if (token) {
      setLoading(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      api.get<AuthResponse>('/auth/me')
        .then(response => {
          console.log('Respuesta /me:', response.data);
          const { empleado } = response.data;
          setUser({
            id: empleado.id,
            nombre: empleado.nombre,
            username: empleado.username,
            rol: empleado.rol
          });
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error('Error en /me:', error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setIsAuthenticated(false);
          setUser(null);
          navigate('/login');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      if (window.location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [navigate]);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { username, password });
      const { token, empleado } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      if (empleado) {
        setUser({
          id: empleado.id,
          nombre: empleado.nombre,
          username: empleado.username,
          rol: empleado.rol
        });
        setIsAuthenticated(true);
        navigate('/');
      } else {
        throw new Error('No se recibieron datos del usuario');
      }
    } catch (error) {
      console.error('Error de login:', error);
      throw new Error('Credenciales inválidas');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {!loading ? children : <div>Cargando...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  console.log("Context: ", context);
  return context;
}; 