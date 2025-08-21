import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { api } from "../../api/apiRoutes";

export const SalesChart = () => {
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);
  const [salesDateRange, setSalesDateRange] = useState('all');
  const [availableRanges, setAvailableRanges] = useState({});

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await api.get('/value/filtered?sort=ASC&startDate=2025-06-01&sensors=Sensor Temperatura Máxima,Sensor Temperatura Mínima,Sensor Temperatura Promedio');
        const sensorsData = response.data.data;
        const allDates = Array.from(new Set(sensorsData.flatMap(sd => sd.values.map(v => v.date)))).sort();

        const ranges = {
          '15d': allDates.length >= 15,
          '1m': allDates.length >= 30,
          '3m': allDates.length >= 90,
          '6m': allDates.length >= 180,
          '1a': allDates.length >= 365,
        };
        setAvailableRanges(ranges);

        let sortedDates = [...allDates];
        if (salesDateRange === '15d') sortedDates = sortedDates.slice(-15);
        else if (salesDateRange === '1m') sortedDates = sortedDates.slice(-30);
        else if (salesDateRange === '3m') sortedDates = sortedDates.slice(-90);
        else if (salesDateRange === '6m') sortedDates = sortedDates.slice(-180);
        else if (salesDateRange === '1a') sortedDates = sortedDates.slice(-365);

        const seriesData = sensorsData.map((sensorGroup, idx) => {
          const colors = ["#1A56DB", "#7E3BF2", "#10B981", "#F59E0B"];
          const color = colors[idx % colors.length];
          const dateMap = Object.fromEntries(sensorGroup.values.map(v => [v.date, v.value]));
          const data = sortedDates.map(d => dateMap[d] ?? null);
          return { name: sensorGroup.sensor, data, color };
        });

        setSeries(seriesData);

        setOptions({
          chart: { type: "area", height: "100%", fontFamily: "Inter, sans-serif", toolbar: { show: false } },
          tooltip: { enabled: true, x: { show: false } },
          fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0, shade: "#1450c9ff", gradientToColors: ["#1C64F2"] } },
          dataLabels: { enabled: false },
          stroke: { width: 6 },
          grid: { show: false },
          xaxis: { categories: sortedDates, labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
          yaxis: { show: true },
        });
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSalesData();
  }, [salesDateRange]);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
      <div className="flex justify-between">
        <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">Rangos de Temperatura</h5>
        <select value={salesDateRange} onChange={e => setSalesDateRange(e.target.value)}
          className="border rounded px-3 text-xs cursor-pointer outline-none">
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
};
