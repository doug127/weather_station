import { useEffect, useState } from "react";
import { Card } from "./card/Card";
import { djangoApi } from "@/shared/api/apiRoutes";

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
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await djangoApi.get("/predict-model/latest/");
        console.log("Predicciones obtenidas:", res);
        setPredictions(res.data);
      } catch (err) {
        console.error("Error fetching predictions:", err);
      }
    };

    fetchPredictions();
  }, []);

  if (!predictions) {
    return <p className="p-4">Cargando predicciones...</p>;
  }

  const { prediction_date, predictions: predValues, input_data } = predictions;
  const formattedDate = formatDate(prediction_date);

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      {/* Título */}
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Predicciones del día ({formattedDate})
      </h3>

      {/* Grid de Cards */}
      <div className="grid lg:gap-6 md:gap-4 gap-2 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {Object.entries(predValues).map(([key, value]) => {
          const inputValue = predictions.input_data[key];
          const icon =
            value >= inputValue ? "fa-chart-line-up" : "fa-chart-line-down";

          return (
            <Card
              key={key}
              icon={icon}
              title={key.toUpperCase()}
              value={`${value.toFixed(2)} (input: ${inputValue})`}
            />
          );
        })}
      </div>
    </div>
  );
};