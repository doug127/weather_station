import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Cargando...</p>; // o spinner
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children ? children : <Outlet />;
};