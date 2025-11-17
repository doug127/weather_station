import Chart from "react-apexcharts";
import { useChart } from "@/features/Home/hooks/charts/useChart";
import { SelectTime } from "@/features/Home/components/forms/selects/SelectTime";
import { SkeletonChart } from "@/shared/components/skeletons/SkeletonPage";

export const ChartContainer = ({
  title,
  subtitle,
  mode = "multi",
  showSensorSelector = false,
  height = 300,
  dateLastYear,
  ...hookProps
}) => {
  const {
    chartOptions,
    series,
    dateRange,
    loading,
    error,
    sensorInfo,
    availableSensors,
    selectedSensor,
    setDateRange,
    setSelectedSensor
  } = useChart({
    mode,
    dateLastYear,
    ...hookProps
  });

  const displayTitle =
    mode === "single"
      ? sensorInfo.sensor || title || "Cargando..."
      : title;
  const displaySubtitle =
    mode === "single"
      ? sensorInfo.variable
      : subtitle;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col flex-grow">
          <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">
            {displayTitle}
          </h5>
          {displaySubtitle && (
            <p className="text-base font-normal text-gray-500">
              {displaySubtitle}
            </p>
          )}
        </div>

        <div className="flex gap-3 flex-shrink-0">
          <SelectTime
            value={dateRange}
            setValue={setDateRange}
            loading={loading}
          />

          {showSensorSelector && (
            <select
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              className="border rounded px-3 text-xs cursor-pointer outline-none"
              disabled={loading}
            >
              {availableSensors.map((sensor) => (
                <option key={sensor} value={sensor}>
                  {sensor}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Gráfico */}
      <div className="mt-4 relative overflow-hidden" style={{ height: `${height}px` }}>
        {loading ? (
          <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
            <SkeletonChart />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-white/90 z-20">
            Error: {error}
          </div>
        ) : series.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-white/90 z-20">
            No hay datos disponibles
          </div>
        ) : (
          <Chart
            options={chartOptions}
            series={series}
            type="area"
            height={height}
          />
        )}
      </div>
    </div>
  );
};