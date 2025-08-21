import { useState, useEffect } from "react";
import { SensorChart } from "../../components/charts/SensorChart";
import { SalesChart } from "../../components/charts/SalesChart";
import { LeadsChart } from "../../components/charts/LeadsChart";
import { ProfitChart } from "../../components/charts/ProfitChart";
import { PieChart } from "../../components/charts/PieChart";
import { LineChart } from "../../components/charts/LineChart";
import { api } from "../../api/apiRoutes";


export const Statistics = () => {
  // --- Sensor Chart ---
  const [usersOptions, setUsersOptions] = useState({});
  const [usersSeries, setUsersSeries] = useState([]);
  const [sensorInfo, setSensorInfo] = useState({
    sensor: '',
    variable: '',
    unit: '',
    lastUpdated: ''
  });
  const [dateRange, setDateRange] = useState('all');

  // --- Sales Chart ---
  const [salesOptions, setSalesOptions] = useState({});
  const [salesSeries, setSalesSeries] = useState([]);
  const [salesDateRange, setSalesDateRange] = useState('all');
  const [salesAvailableRanges, setSalesAvailableRanges] = useState({
    '15d': true,
    '1m': true,
    '3m': true,
    '6m': true,
    '1a': true
  });

  // --- Leads Chart ---
  const [leadsOptions, setLeadsOptions] = useState({
    colors: ["#1A56DB", "#FDBA8C"],
    series: [
      {
        name: "Organic",
        color: "#1A56DB",
        data: [
          { x: "Mon", y: 231 },
          { x: "Tue", y: 122 },
          { x: "Wed", y: 63 },
          { x: "Thu", y: 421 },
          { x: "Fri", y: 122 },
          { x: "Sat", y: 323 },
          { x: "Sun", y: 111 },
        ],
      },
      {
        name: "Social media",
        color: "#FDBA8C",
        data: [
          { x: "Mon", y: 232 },
          { x: "Tue", y: 113 },
          { x: "Wed", y: 341 },
          { x: "Thu", y: 224 },
          { x: "Fri", y: 522 },
          { x: "Sat", y: 411 },
          { x: "Sun", y: 243 },
        ],
      },
    ],
    chart: {
      type: "bar",
      height: 300,
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadiusApplication: "end",
        borderRadius: 8,
      },
    },
    tooltip: { shared: true, intersect: false },
    grid: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      labels: {
        show: true,
        style: {
          colors: "#000",
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
  });

  // --- Profit Chart ---
  const [categories, setCategories] = useState([]); 
  const [profitOptions, setProfitOptions] = useState({
    series: [{
      name: "Precipitación (mm)",
      color: "#31C48D",
      data: [],
    }],
    chart: {
      type: "bar",
      height: 400,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "50%", borderRadius: 6 },
    },
    dataLabels: { enabled: false },
    legend: { show: true, position: "bottom" },
    xaxis: { categories },
    yaxis: { title: { text: "mm de lluvia" } },
    tooltip: { shared: true, intersect: false },
  });

  // --- Pie & Line Charts ---
  const [pieOptions, setPieOptions] = useState({});
  const [pieSeries, setPieSeries] = useState([]);
  const [lineOptions, setLineOptions] = useState({});
  const [lineSeries, setLineSeries] = useState([]);

  // --- Fetch Sensor Chart ---
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

        setUsersOptions({
          chart: { type: "area", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
          tooltip: { enabled: true, x: { show: false } },
          fill: { type: "gradient", gradient: { shade: "light", opacityFrom: 0.75, opacityTo: 0, gradientToColors: ["#164cb7ff"] } },
          dataLabels: { enabled: false },
          stroke: { width: 4 },
          grid: { show: false },
          xaxis: { categories: dates, labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
          yaxis: { show: true },
        });
        setUsersSeries([{ name: sensorData.sensor, data: seriesData, color: "#1A56DB" }]);
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

  // --- Fetch Sales Chart ---
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await api.get('/value/filtered?sort=ASC&startDate=2025-06-01&sensors=Sensor Temperatura Máxima,Sensor Temperatura Mínima, Sensor Temperatura Promedio');
        const sensorsData = response.data.data;
        const allDates = Array.from(new Set(sensorsData.flatMap(sd => sd.values.map(v => v.date)))).sort();

        // Available ranges
        const availableRanges = {
          '15d': allDates.length >= 15,
          '1m': allDates.length >= 30,
          '3m': allDates.length >= 90,
          '6m': allDates.length >= 180,
          '1a': allDates.length >= 365,
        };
        setSalesAvailableRanges(availableRanges);

        let sortedDates = [...allDates];
        if (salesDateRange === '15d') sortedDates = sortedDates.slice(-15);
        else if (salesDateRange === '1m') sortedDates = sortedDates.slice(-30);
        else if (salesDateRange === '3m') sortedDates = sortedDates.slice(-90);
        else if (salesDateRange === '6m') sortedDates = sortedDates.slice(-180);
        else if (salesDateRange === '1a') sortedDates = sortedDates.slice(-365);

        const series = sensorsData.map((sensorGroup, idx) => {
          const colorPalette = ["#1A56DB", "#7E3BF2", "#10B981", "#F59E0B"];
          const color = colorPalette[idx % colorPalette.length];
          const dateToValue = Object.fromEntries(sensorGroup.values.map(v => [v.date, v.value]));
          const data = sortedDates.map(date => dateToValue[date] ?? null);
          return { name: sensorGroup.sensor, data, color };
        });

        setSalesOptions({
          chart: { height: "100%", type: "area", fontFamily: "Inter, sans-serif", toolbar: { show: false } },
          tooltip: { enabled: true, x: { show: false } },
          fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0, shade: "#1450c9ff", gradientToColors: ["#1C64F2"] } },
          dataLabels: { enabled: false },
          stroke: { width: 6 },
          grid: { show: false },
          xaxis: { categories: sortedDates, labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
          yaxis: { show: true },
        });
        setSalesSeries(series);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSalesData();
  }, [salesDateRange]);

  // --- Pie and Line Charts setup ---
  useEffect(() => {
    setPieOptions({
      colors: ["#1C64F2", "#16BDCA", "#9061F9"],
      chart: { type: "pie", height: 420, width: "100%" },
      stroke: { colors: ["#fff"], lineCap: "round" },
      labels: ["Direct", "Organic search", "Referrals"],
      dataLabels: { enabled: true, style: { fontFamily: "Inter, sans-serif", fontSize: "14px" } },
      legend: { position: "bottom", fontFamily: "Inter, sans-serif" }
    });
    setPieSeries([52.8, 26.8, 20.4]);

    setLineOptions({
      chart: { type: "line", height: 300, toolbar: { show: false } },
      stroke: { curve: "smooth", width: 2 },
      xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      colors: ["#1C64F2"]
    });
    setLineSeries([{ name: "Visitors", data: [10, 20, 15, 30, 40, 35, 50] }]);
  }, []);

  return (
    <div>
      <div className="w-full p-4">
        <SensorChart
          options={usersOptions}
          series={usersSeries}
          sensorInfo={sensorInfo}
          dateRange={dateRange}
          onDateChange={setDateRange}
        />
      </div>

      <div className="w-full mt-6 p-4">
        <SalesChart
          options={salesOptions}
          series={salesSeries}
          salesDateRange={salesDateRange}
          onDateChange={setSalesDateRange}
          availableRanges={salesAvailableRanges}
        />
      </div>

      <div className="grid gap-4 p-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        <LeadsChart options={leadsOptions} />
      </div>

      <div className="w-full mt-6 p-4">
        <ProfitChart options={profitOptions} />
      </div>

      <div className="flex mt-6 p-4 space-x-5">
        <PieChart options={pieOptions} series={pieSeries} title="Website traffic" />
        <LineChart options={lineOptions} series={lineSeries} title="Visitors Overview" />
      </div>
    </div>
  );
};
