import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const PublicRoute = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};