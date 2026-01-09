import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Login } from './pages/Login';
import { MisPrestamos } from './pages/MisPrestamos';
import { AdminPrestamos } from './pages/AdminPrestamos';
import { useAuthStore } from './stores/authStore';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Navigate to="/dashboard/prestamos" replace />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/prestamos"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MisPrestamos />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin-prestamos"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminPrestamos />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard/prestamos" replace />} />
      <Route path="*" element={<Navigate to="/dashboard/prestamos" replace />} />
    </Routes>
  );
}

export default App;
