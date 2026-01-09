import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user, token } = useAuth();
  
  const isLoading = token && !user;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        Carregando...
      </div>
    );
  }

  if (isAuthenticated && user?.role === 'admin') {
    return <>{children}</>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;