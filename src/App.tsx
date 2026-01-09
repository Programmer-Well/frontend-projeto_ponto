import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute'; 
import './App.css';

const AuthRedirector: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      const isLoginPage = location.pathname === '/login';
      if (isLoginPage) {
        const targetPath = user.role === 'admin' ? '/admin/users' : '/dashboard';
        navigate(targetPath, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  return null;
};

const AppRoutes: React.FC = () => {
  const { isBackendOnline } = useAuth();

  const errorBannerStyle: React.CSSProperties = {
    backgroundColor: '#dc3545',
    color: 'white',
    textAlign: 'center',
    padding: '10px',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
  };

  return (
    <>
      <AuthRedirector />

      {!isBackendOnline && (
        <div style={errorBannerStyle}>
          Erro de conexão: O servidor está indisponível.
        </div>
      )}

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;