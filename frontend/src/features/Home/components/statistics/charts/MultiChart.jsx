import { useSelectSensorChart } from "@/features/Home/hooks/charts/useSelectSensorChart";
import Chart from "react-apexcharts";
import { SelectTime } from "@/features/Home/components/forms/selects/SelectTime";
import { SkeletonPage } from "@/shared/components/skeletons/SkeletonPage";
import { useTickAmount } from "@/features/Home/hooks/charts/useTickAmount";

export const MultiChart = ({ dateLastYear, excludedSensors }) => {
  const tickAmount = useTickAmount();

  const {
    options,
    series,
    salesDateRange,
    setSalesDateRange,
    availableSensors,
    selectedSensor,
    setSelectedSensor,
    loading,
    error,
  } = useSelectSensorChart({ dateLastYear, excludedSensors, tickAmount });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      {/* 🔹 Encabezado con título y selectores */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h5 className="leading-none text-2xl font-bold text-gray-900">
          Otros Sensores
        </h5>

        <div className="flex gap-3">
          {/* Selector de tiempo */}
          <SelectTime value={salesDateRange} setValue={setSalesDateRange} loading={loading} />

          {/* Selector de sensores */}
          <select
            value={selectedSensor}
            onChange={(e) => {
              e.preventDefault();
              setSelectedSensor(e.target.value);
            }}
            className="border rounded px-3 text-xs cursor-pointer outline-none"
            disabled={loading}
          >
            {availableSensors.map((sensor) => (
              <option key={sensor} value={sensor}>
                {sensor}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🔹 Contenedor del gráfico */}
      <div className="mt-6 relative h-[350px] overflow-hidden">
        {/* 🔹 Chart siempre montado */}
        <Chart options={options} series={series} type="area" height={350} />

        {/* 🔸 SkeletonPage o capa de carga solo sobre el gráfico */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="w-[95%] h-[90%] flex items-center justify-center">
              <SkeletonPage />
            </div>
          </div>
        )}

        {/* 🔸 Error */}
        {!loading && error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-white/90 z-20">
            No hay datos disponibles para el rango seleccionado
          </div>
        )}

        {/* 🔸 Sin datos */}
        {!loading && !error && series.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-white/90 z-20">
            No hay datos disponibles para el rango seleccionado
          </div>
        )}
      </div>
    </div>
  );
};
