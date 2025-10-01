import { useEffect, useState } from "react";
import { api } from "@/shared/api/apiRoutes";

export const useSensors = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const res = await api.get("/sensor");
        setSensors(res.data.data);
      } catch (error) {
        console.error("❌ Error al cargar sensores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
  }, []);

  return { sensors, loading };
};