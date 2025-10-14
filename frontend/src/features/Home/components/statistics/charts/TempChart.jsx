import { useMultiChart } from "@/features/Home/hooks/charts/useMultiChart";
import Chart from "react-apexcharts";
import { SelectTime } from "@/features/Home/components/forms/selects/SelectTime";
import { SkeletonPage, SkeletonChart } from "@/shared/components/skeletons/SkeletonPage";

export const TempChart = ({ dateLastYear, sensorTempChart }) => {
  const {
    chartOptions,
    series,
    dateRange,
    loading,
    error,
    setDateRange
  } = useMultiChart({
    sensors: sensorTempChart,
    dateLastYear
  });

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
      {/* 🔹 Header: no se toca */}
      <div className="flex justify-between items-start flex-wrap gap-3">
        <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">
          Rangos de Temperatura
        </h5>
        <SelectTime
          value={dateRange}
          setValue={setDateRange}
          loading={loading}
        />
      </div>

      {/* 🔹 Contenedor del gráfico */}
      <div className="mt-4 relative h-[300px] overflow-hidden">
        {/* El gráfico SIEMPRE se renderiza */}
        <Chart
          options={chartOptions}
          series={series}
          type="area"
          height={300}
        />

        {/* 🔸 Capa de carga sobre el área del gráfico */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="w-[100%] h-[85%] flex items-center justify-center">
              <SkeletonChart />
            </div>
          </div>
        )}

        {/* 🔸 Error visible sobre el gráfico */}
        {!loading && error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-white/90 z-20">
            Error: {error}
          </div>
        )}

        {/* 🔸 Mensaje sin datos */}
        {!loading && !error && series.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-white/90 z-20">
            No hay datos disponibles para el rango seleccionado
          </div>
        )}
      </div>
    </div>
  );
};

