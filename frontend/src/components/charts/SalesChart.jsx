import Chart from "react-apexcharts";

export const SalesChart = ({ options, series, salesDateRange, onDateChange, availableRanges }) => (
  <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
    <div className="flex justify-between">
      <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">Rangos de Temperatura</h5>
      <select
        value={salesDateRange}
        onChange={e => onDateChange(e.target.value)}
        className="border rounded px-3 text-xs cursor-pointer outline-none"
      >
        <option value="all">Filtrar por rango de tiempo</option>
        <option value="15d" disabled={!availableRanges['15d']}>Últimos 15 días</option>
        <option value="1m" disabled={!availableRanges['1m']}>Último mes</option>
        <option value="3m" disabled={!availableRanges['3m']}>Últimos 3 meses</option>
        <option value="6m" disabled={!availableRanges['6m']}>Últimos 6 meses</option>
        <option value="1a" disabled={!availableRanges['1a']}>Último año</option>
      </select>
    </div>
    <div className="mt-4">
      <Chart options={options} series={series} type="area" height={300} />
    </div>
  </div>
);
