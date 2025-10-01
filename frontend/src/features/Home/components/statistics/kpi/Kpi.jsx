import { Card } from "./card/Card";
import { useLatestPredictions } from "@/features/Home/hooks/statistics/useLatestPredictions";
import { useSensors } from "@/features/Home/hooks/statistics/useSensors";
import { ICONS_BY_VARIABLE } from "@/features/Home/utils/IconsMap";
import { formatDate } from "@/features/Home/utils/formatDate";
// Función para formatear la fecha tipo "Lunes, 16 de septiembre"

export const KPIs = () => {
  const { latestPrediction, loading: loadingPreds } = useLatestPredictions();
  const { sensors, loading: loadingSensors } = useSensors();

  if (loadingPreds || loadingSensors) {
    return <p className="p-4">Cargando datos...</p>;
  }

  if (!latestPrediction) {
    return <p className="p-4">No hay predicciones disponibles.</p>;
  }

  const { prediction_date, predictions } = latestPrediction;
  const { predictions: predicted_data } = predictions;
  const formattedDate = formatDate(prediction_date);

  // 📌 Mapeo de códigos -> nombres de variable
  const codeToVariableName = sensors.reduce((acc, s) => {
    acc[s.code] = { 
      name: s.variable?.name ?? s.name,
      unit: s.variable?.unit ?? ""
    };
    return acc;
  }, {});

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Predicciones del día{" "}
        <span className="text-sm text-gray-400">- {formattedDate}</span>
      </h3>

      <div className="flex flex-wrap justify-start gap-4">
        {Object.entries(predicted_data).map(([code, predictedValue]) => {
          const variableInfo = codeToVariableName[code] || {}; // 🔹 solo para icono
          const icon = ICONS_BY_VARIABLE[variableInfo.name] || "fa-solid fa-circle-question";

          return (
            <Card
              key={code}
              icon={icon}
              title={code.toUpperCase()} // 🔹 aquí ya va el código
              value={`${predictedValue.toFixed(2)} ${variableInfo.unit}`} // 🔹 y aquí la unidad
            />
          );
        })}
      </div>
    </div>
  );
};
