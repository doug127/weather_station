import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const PublicRoute = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  const skipCheck = sessionStorage.getItem("skipSessionCheck");
  if (skipCheck === "true") {
    return children;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};