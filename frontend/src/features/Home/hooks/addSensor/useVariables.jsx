import { useEffect, useState } from "react";
import { api } from "@/shared/api/apiRoutes";

export const useVariables = () => {
  const [dataVariable, setDataVariable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const response = await api.get("/variable/all");
        setDataVariable(response.data.variables);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariables();
  }, []);

  return { dataVariable, loading };
};
