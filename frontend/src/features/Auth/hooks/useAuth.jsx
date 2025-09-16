import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/shared/api/apiRoutes";
import { Context } from "@/shared/api/contextProvider";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setOptionBanner } = useContext(Context);

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(
        "/auth/login", 
        { username, password },
        { withCredentials: true }
      );

      const res = await api.get("/auth/me", { withCredentials: true });
      console.log("Usuario logeado: ", res.data.user);
      setUser(res.data.user);
      navigate("/Home");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};