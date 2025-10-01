import { useEffect, useState } from 'react';
import { api } from '@/shared/api/apiRoutes';

export const useFetchSensor = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await api.get("/sensor");
        setSensors(response.data.data);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
  }, []);

  return { sensors, loading };
};