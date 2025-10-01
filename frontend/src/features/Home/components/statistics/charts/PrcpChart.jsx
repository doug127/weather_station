import { useSingleChart } from "@/features/Home/hooks/charts/useSingleChart";
import Chart from "react-apexcharts";
import { SkeletonPage } from "@/shared/components/skeletons/SkeletonPage";
import { SelectTime } from "@/features/Home/components/forms/selects/SelectTime";

export const PrcpChart = ({ dateLastYear, sensorPrcpChart }) => {
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
    dateLastYear
  });

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
      <div className="flex justify-between">
        <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">
          {sensorInfo.sensor || 'Cargando...'}
        </h5>
        <SelectTime value={dateRange} setValue={setDateRange} loading={loading} />
      </div>
      
      <p className="text-base font-normal text-gray-500">
        {sensorInfo.variable}
      </p>
      
      <div className="mt-4 object-contain">
        {loading ? (
          <SkeletonPage />
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-red-500">
            Error: {error}
          </div>
        ) : series.length > 0 ? (
          <Chart 
            options={chartOptions} 
            series={series} 
            type="area" 
            height={300} 
          />
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            No hay datos disponibles para el rango seleccionado
          </div>
        )}
      </div>
    </div>
  );
};