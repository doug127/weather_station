import { useEffect, useState } from "react";
import { Card } from "./card/Card";
import { djangoApi } from "@/shared/api/apiRoutes";
import { TrainAndPredict } from "@/features/Home/components/prediction/TrainAndPredict";

// Función para formatear la fecha tipo "Lunes, 16 de septiembre"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export const KPIs = () => {
  const [latestPrediction, setLatestPrediction] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await djangoApi.get("/predict-model/latest");
        console.log("Predicciones obtenidas:", res.data);
        setLatestPrediction(res.data); // guardamos toda la respuesta
      } catch (err) {
        console.error("Error fetching predictions:", err);
      }
    };

    fetchPredictions();
  }, []);

  if (!latestPrediction) {
    return <p className="p-4">Cargando predicciones...</p>;
  }

  // Extraemos del formato real
  const { prediction_date, predictions } = latestPrediction;
  const { input_data, predictions: predicted_data } = predictions;

  const formattedDate = formatDate(prediction_date);

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      {/* Título */}
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Predicciones del día <span className="text-sm text-gray-400">- {formattedDate}</span>
      </h3>

      {/* Contenedor flexible para las Cards */}
      <div className="flex flex-wrap justify-start gap-4">
        {Object.entries(predicted_data).map(([key, predictedValue]) => {
          const inputValue = input_data[key] ?? null;
          const icon = "fa-solid fa-cloud-sun";
            console.log(input_data.wspd)
          return (
            <Card
              key={key}
              icon={icon}
              title={key.toUpperCase()}
              value={
                inputValue !== null
                  ? `${predictedValue.toFixed(2)} ${inputValue}`
                  : `${predictedValue.toFixed(2)}`
              }
              data_testid={input_data.wspd}
            />
          );
        })}
      </div>
    </div>
  );
};
