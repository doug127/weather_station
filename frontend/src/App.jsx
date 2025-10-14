import {Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { MotionWrapper } from './features/Home/layouts/MotionWrapper'
import { RequireRole } from '@/shared/components/role/RequireRole'
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
import { NavigationMap } from './features/Home/utils/NavigationMap'


export const App = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const navigationValues = Object.values(NavigationMap);

  if (loading) return <SkeletonPage />;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Redirección principal */}
        <Route
          path="/"
          element={
            sessionStorage.getItem("skipSessionCheck") === "true"
              ? <Navigate to="/verify-email" replace />
              : user
              ? <Navigate to="/home" replace />
              : <Navigate to="/auth" replace />
          }
        />

        {/* Rutas públicas */}
        <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
        <Route path="/verify-email" element={<PublicRoute><Validation /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-code" element={<PublicRoute><ResetCode /></PublicRoute>} />

        {/* Rutas protegidas */}
        <Route
          path="/home/*"
          element={
            <ProtectedRoute user={user}>
              <Sidebar />
            </ProtectedRoute>
          }
        >
          {/* Rutas hijas dentro del Sidebar */}
          <Route index element={<Navigate to="init" replace />} />
          {navigationValues.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={
                <RequireRole minRole={page.role_id} user={user}>
                  <MotionWrapper><page.component /></MotionWrapper>
                </RequireRole>
              }
            />
          ))}
          
        </Route>

        {/* Ruta de fallback */}
        <Route
          path="*"
          element={
            sessionStorage.getItem("skipSessionCheck") === "true"
              ? <Navigate to="/verify-email" replace />
              : user
              ? <Navigate to="/home" replace />
              : <Navigate to="/auth" replace />
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

