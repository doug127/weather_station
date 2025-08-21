import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { api } from "../../api/apiRoutes";

export const SensorChart = () => {
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);
  const [sensorInfo, setSensorInfo] = useState({ sensor: '', variable: '', unit: '', lastUpdated: '' });
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await api.get('/value/filtered?sensor=Pluviómetro&startDate=2025-01-01&sort=DESC');
        const sensorData = response.data.data[0];
        if (!sensorData) return;

        let values = sensorData.values || [];
        if (dateRange === '15d') values = values.slice(-15);
        else if (dateRange === '1m') values = values.slice(-30);
        else if (dateRange === '3m') values = values.slice(-90);
        else if (dateRange === '6m') values = values.slice(-180);

        const dates = values.map(v => {
          const [year, month, day] = v.date.split('-');
          return `${day}/${month}/${year.slice(2)}`;
        });
        const seriesData = values.map(v => v.value);

        setOptions({
          chart: { type: "area", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
          tooltip: { enabled: true, x: { show: false } },
          fill: { type: "gradient", gradient: { shade: "light", opacityFrom: 0.75, opacityTo: 0, gradientToColors: ["#164cb7ff"] } },
          dataLabels: { enabled: false },
          stroke: { width: 4 },
          grid: { show: false },
          xaxis: { categories: dates, labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
          yaxis: { show: true },
        });
        setSeries([{ name: sensorData.sensor, data: seriesData, color: "#1A56DB" }]);
        setSensorInfo({
          sensor: sensorData.sensor,
          variable: sensorData.variable,
          unit: sensorData.unit,
          lastUpdated: response.data.lastUpdated
        });
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };
    fetchSensorData();
  }, [dateRange]);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
      <div className="flex justify-between">
        <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">{sensorInfo.sensor}</h5>
        <select value={dateRange} onChange={e => setDateRange(e.target.value)}
          className="border rounded px-3 py-2 text-xs cursor-pointer outline-none">
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
        {series[0]?.data?.length > 0 && <Chart options={options} series={series} type="area" height={300} />}
      </div>
      <div className="p-2 border-t order-gray-200 text-gray-400">
        <p>{sensorInfo.lastUpdated}</p>
      </div>
    </div>
  );
};
