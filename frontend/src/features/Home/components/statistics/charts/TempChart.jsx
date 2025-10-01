import { useMultiChart } from "@/features/Home/hooks/charts/useMultiChart";
import Chart from "react-apexcharts";
import { SelectTime } from "@/features/Home/components/forms/selects/SelectTime";

export const TempChart = ({dateLastYear, sensorTempChart}) => {
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
      <div className="flex justify-between">
        <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">Rangos de Temperatura</h5>
        <SelectTime value={dateRange} setValue={setDateRange} loading={loading} />
      </div>
      
      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            Cargando datos...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-red-500">
            Error: {error}
          </div>
        ) : series.length > 0 ? (
          <Chart options={chartOptions} series={series} type="area" height={300} />
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            No hay datos disponibles para el rango seleccionado
          </div>
        )}
      </div>
    </div>
  );
};
