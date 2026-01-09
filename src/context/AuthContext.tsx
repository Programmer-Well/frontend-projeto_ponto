import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user'; 
  exp: number;
  iat: number;
  
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isBackendOnline: boolean;
  login: (email: string, password: string) => Promise<true | string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [isBackendOnline] = useState<boolean>(true); 
  const navigate = useNavigate();

  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode<User>(storedToken);
        
        const currentTime = Date.now() / 1000;
        if (decodedUser.exp < currentTime) {
          logout();
        } else {
          setUser(decodedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (e) {
        logout();
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<true | string> => {
    try {
      const response = await api.post<{ access_token: string }>('/auth/login', { email, password });
      const { access_token } = response.data;

      localStorage.setItem('token', access_token);
      const decodedUser = jwtDecode<User>(access_token);

      setUser(decodedUser);
      setToken(access_token);
      setIsAuthenticated(true);

      if (decodedUser.role === 'admin') {
        navigate('/admin/users');
      } else {
        navigate('/dashboard');
      }
      return true;

    } catch (error: any) {
      console.error("Erro de login:", error);
      const errorMessage = error.response?.data?.message || 'Falha no login. Verifique suas credenciais.';
      return errorMessage;
    }
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, isBackendOnline, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};