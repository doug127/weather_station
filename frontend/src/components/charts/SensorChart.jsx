import Chart from "react-apexcharts";

export const SensorChart = ({ options, series, sensorInfo, dateRange, onDateChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
      <div className="flex justify-between">
        <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">
          {sensorInfo.sensor}
        </h5>
        <select
          value={dateRange}
          onChange={e => onDateChange(e.target.value)}
          className="border rounded px-3 py-2 text-xs cursor-pointer outline-none"
        >
          <option value="all">Filtrar por rango de tiempo</option>
          <option value="15d">Últimos 15 días</option>
          <option value="1m">Último mes</option>
          <option value="3m">Últimos 3 meses</option>
          <option value="6m">Últimos 6 meses</option>
          <option value="1a">Último año</option>
        </select>
      </div>
      <p className="text-base font-normal text-gray-500">{sensorInfo.variable}</p>
      <div className="mt-4 object-contain">
        {series[0]?.data?.length > 0 && (
          <Chart options={options} series={series} type="area" height={300} />
        )}
      </div>
      <div className="p-2 border-t order-gray-200 text-gray-400">
        <p>
          <i className="fa-solid fa-clock p-2"></i>
          {sensorInfo.lastUpdated}
        </p>
      </div>
    </div>
  );
};
