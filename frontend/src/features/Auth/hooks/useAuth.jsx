import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/shared/api/apiRoutes";
import { Context } from "@/shared/api/contextProvider";

export const useAuth = () => {
  const [loading, setLoading] = useState(true); // start loading until user is fetched
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useContext(Context);

  // Verificar si ya hay sesión activa al montar
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const res = await api.get("/auth/me", { withCredentials: true });
        const user = res.data.user;
        setUser(user);

        // Redirige solo si NO es admin
        if (user && user.role_id !== "admin") {
          navigate("/Home");
        }
      } catch (err) {
        // No hay sesión, no redireccionamos
        console.log("No hay sesión activa");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate, setUser]);

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      await api.post("/auth/login", { username, password }, { withCredentials: true });

      const res = await api.get("/auth/me", { withCredentials: true });
      const user = res.data.user;
      setUser(user);

      // Redirige solo si NO es admin
      if (user && user.role_id !== "admin") {
        navigate("/Home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};
