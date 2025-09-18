import {Routes, Route, Navigate} from 'react-router-dom'
import { Home } from '@/features/Home/pages/Home'
import { Auth } from '@/features/Auth/pages/Auth'
import { Validation } from '@/features/Auth/pages/Validation'
import { ForgotPassword } from '@/features/Auth/pages/ForgotPassword'
import { ResetCode } from '@/features/Auth/pages/ResetCode'
import { ProtectedRoute } from '@/shared/hooks/ProtectedRoute'
import { PublicRoute } from '@/shared/hooks/PublicRoute'
import { useContext } from 'react'
import { AuthContext } from '@/shared/hooks/AuthContext'
import { Sidebar } from '@/features/Home/layouts/Sidebar'
import { SkeletonPage } from '@/shared/components/skeletons/SkeletonPage'

export const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <SkeletonPage />;

  return (
    <Routes>
      {/* Ruta raíz - redirigir según el estado de autenticación */}
      <Route 
        path="/" 
        element={
          user ? <Navigate to="/home" replace /> : <Navigate to="/auth" replace />
        } 
      />

      {/* Rutas públicas */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <Validation />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-code"
        element={
          <PublicRoute>
            <ResetCode />
          </PublicRoute>
        }
      />

      {/* Rutas protegidas */}
      <Route
        path="/home/*"
        element={
          <ProtectedRoute user={user}>
            <Sidebar />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="" element={<Home />} />
      </Route>

      {/* Ruta de fallback para cualquier ruta no encontrada */}
      <Route 
        path="*" 
        element={
          user ? <Navigate to="/home" replace /> : <Navigate to="/auth" replace />
        } 
      />
    </Routes>
  );
};