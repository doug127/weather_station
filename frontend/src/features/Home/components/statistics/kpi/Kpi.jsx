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
  const [predictions, setPredictions] = useState(null);
  const AdminRole = 1;

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

      {/* <TrainAndPredict user={{ role_id: AdminRole }} /> */}

      {/* Contenedor flexible para las Cards */}
      <div className="flex flex-wrap justify-start gap-4">
        {Object.entries(predValues).map(([key, value]) => {
          const inputValue = input_data[key];
          const icon = value >= inputValue ? "fa-chart-line-up" : "fa-chart-line-down";

          return (
            <div
              key={key}
              className="flex-1 min-w-[220px] max-w-[32%] bg-white rounded-md shadow-lg p-4 flex items-center gap-4"
            >
              {/* Icono */}
              <div className="flex-shrink-0 text-white bg-gray-900 w-12 h-12 rounded-md flex justify-center items-center text-2xl">
                <i className={`fa-solid ${icon}`}></i>
              </div>

              {/* Información */}
              <div className="flex flex-col">
                <p className="text-gray-700 font-medium">{key.toUpperCase()}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {value.toFixed(2)} (input: {inputValue})
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};