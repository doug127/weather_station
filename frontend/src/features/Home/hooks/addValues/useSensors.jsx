import { useEffect, useState } from "react";
import { api } from "@/shared/api/apiRoutes";

export const useSensors = () => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await api.get("/sensor/");
        
        const dataArray = Array.isArray(response.data)
          ? response.data
          : response.data.data;

        setSensors(dataArray || []);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchSensors();
  }, []);

  return sensors;
};
