import { useSelectSensorChart } from "@/features/Home/hooks/charts/useSelectSensorChart";
import Chart from "react-apexcharts";
import { SelectTime } from "@/features/Home/components/forms/selects/SelectTime";

export const MultiChart = ({ dateLastYear, excludedSensors }) => {
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
  } = useSelectSensorChart({ dateLastYear, excludedSensors });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
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

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-[350px] text-gray-500">
            Cargando datos...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[350px] text-red-500">
            No hay datos disponibles para el rango seleccionado
          </div>
        ) : (
          <Chart options={options} series={series} type="area" height={350} />
        )}
      </div>
    </div>
  );
};
