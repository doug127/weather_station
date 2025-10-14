import { useSingleChart } from "@/features/Home/hooks/charts/useSingleChart";
import Chart from "react-apexcharts";
import { SkeletonPage } from "@/shared/components/skeletons/SkeletonPage";
import { SelectTime } from "@/features/Home/components/forms/selects/SelectTime";
import { useTickAmount } from "@/features/Home/hooks/charts/useTickAmount";

export const PrcpChart = ({ dateLastYear, sensorPrcpChart }) => {
  const tickAmount = useTickAmount();

  const {
    chartOptions,
    series,
    sensorInfo,
    dateRange,
    loading,
    error,
    setDateRange
  } = useSingleChart({
    sensor: sensorPrcpChart,
    dateLastYear,
    tickAmount
  });

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
      {/* 🔹 Encabezado fijo (no se actualiza al cargar) */}
      <div className="flex flex-wrap md:flex-nowrap md:justify-between md:items-center gap-3">
        <div className="flex flex-col flex-grow min-w-[200px]">
          <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">
            {sensorInfo.sensor || "Cargando..."}
          </h5>
          <p className="text-base font-normal text-gray-500">
            {sensorInfo.variable}
          </p>
        </div>

        <div className="flex flex-shrink-0 justify-start md:justify-end md:items-start">
          <SelectTime
            value={dateRange}
            setValue={setDateRange}
            loading={loading}
          />
        </div>
      </div>

      {/* 🔹 Contenedor del gráfico */}
      <div className="mt-4 relative h-[300px] overflow-hidden">
        {/* El gráfico SIEMPRE se mantiene montado */}
        <Chart options={chartOptions} series={series} type="area" height={300} />

        {/* 🔸 Capa de carga solo sobre el área del gráfico */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="w-[95%] h-[85%] flex items-center justify-center">
              <SkeletonPage />
            </div>
          </div>
        )}

        {/* 🔸 Error */}
        {!loading && error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-white/90 z-20">
            Error: {error}
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
