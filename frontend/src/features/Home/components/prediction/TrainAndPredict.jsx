import { RequireRole } from "@/shared/components/role/RequireRole";
import { useState } from "react";
import { api } from "@/shared/api/apiRoutes";  
import { Button } from "@/shared/components/buttons/Button";

export const TrainAndPredict = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleTrainAndPredict = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1️⃣ Entrenar modelo
      console.log("Iniciando entrenamiento del modelo...");
      const trainRes = await api.post("/model/train-model");
      console.log("Train response:", trainRes.data);

      // 2️⃣ Generar predicciones
      const predictRes = await api.post("/model/predict-model", {
        model_name: "rain_predictor_from_node"
      });
      console.log("Predict response:", predictRes.data);

      setSuccess("Modelo entrenado y predicciones generadas correctamente.");
    } catch (err) {
      console.error("Error entrenando o generando predicciones:", err);
      setError(err.response?.data?.message || "Error al entrenar o predecir.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireRole roles={[1]} user={user}>
      <div className="my-4">
        <Button
          onClick={handleTrainAndPredict}
          disabled={loading}
          size="full"
          className="mt-2"
        >
          {loading ? "Procesando..." : "Entrenar y Generar Predicciones"}
        </Button>
        {success && <p className="text-green-500 mt-2">{success}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </RequireRole>
  );
};