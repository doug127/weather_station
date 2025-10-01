import { useState, useEffect } from 'react';
import { djangoApi } from '@/shared/api/apiRoutes';

export const useLatestPredictions = () => {
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      console.log("📡 Pidiendo últimas predicciones...");
      try {
        const res = await djangoApi.get("/predict-model/latest");
        console.log("✅ Predicciones:", res.data);
        setLatestPrediction(res.data);
      } catch (err) {
        console.error("❌ Error cargando predicciones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  return { latestPrediction, loading };
};