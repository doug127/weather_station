import { useState, useEffect } from "react";

// Función para mostrar tiempo relativo
function getRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `hace ${seconds} seg${seconds !== 1 ? 's' : ''}`;
  if (minutes < 60) return `hace ${minutes} min${minutes !== 1 ? 's' : ''}`;
  if (hours < 24) return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  if (days < 7) return `hace ${days} día${days !== 1 ? 's' : ''}`;
  if (weeks < 5) return `hace ${weeks} semana${weeks !== 1 ? 's' : ''}`;
  if (months < 12) return `hace ${months} mes${months !== 1 ? 'es' : ''}`;
  return `hace ${years} año${years !== 1 ? 's' : ''}`;
}
import Chart from "react-apexcharts";
import { api } from "../../api/apiRoutes";

export const Statistics = () => {
  const [pieOptions, setPieOptions] = useState({});
  const [pieSeries, setPieSeries] = useState([]);
  const [lineOptions, setLineOptions] = useState({});
  const [lineSeries, setLineSeries] = useState([]);
  const [data, setData] = useState([]);
  const [usersOptions, setUsersOptions] = useState({
    chart: { type: "area" },
    xaxis: { categories: [] }
  });
  const [sensorInfo, setSensorInfo] = useState({
    sensor: '',
    variable: '',
    unit: '',
    lastUpdated: ''
  });
  const [usersSeries, setUsersSeries] = useState([
    {
      name: "Loading...",
      data: [],
    },
  ]);
  
  const [dateRange, setDateRange] = useState('all');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/value/filtered?sensor=Sensor Temperatura Máxima&startDate=2025-06-01&sort=DESC');
        const sensorData = response.data.data[0];
        let values = sensorData?.values || [];

        // Filtrar por rango seleccionado
        let filteredValues = [...values];
        if (dateRange === '15d') {
          filteredValues = values.slice(-15);
        } else if (dateRange === '1m') {
          filteredValues = values.slice(-30);
        } else if (dateRange === '3m') {
          filteredValues = values.slice(-90);
        } else if (dateRange === '6m') {
          filteredValues = values.slice(-180);
        } // si es 'all', no filtra

        const dates = filteredValues.map(v => {
          const [year, month, day] = v.date.split('-');
          return `${day}/${month}/${year.slice(2)}`;
        });
        const seriesData = filteredValues.map(v => v.value);

        setUsersOptions({
          chart: {
            type: "area",
            toolbar: { show: false },
            fontFamily: "Inter, sans-serif",
          },
          tooltip: { enabled: true, x: { show: false } },
          fill: {
            type: "gradient",
            gradient: {
              shade: "light",
              opacityFrom: 0.75,
              opacityTo: 0,
              gradientToColors: ["#164cb7ff"],
            },
          },
          dataLabels: { enabled: false },
          stroke: { width: 4 },
          grid: { show: false },
          xaxis: {
            categories: dates,
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
          yaxis: { show: true },
        });

        setUsersSeries([
          {
            name: sensorData.sensor,
            data: seriesData,
            color: "#1A56DB",
          },
        ]);

        setSensorInfo({
          sensor: sensorData.sensor,
          variable: sensorData.variable,
          unit: sensorData.unit,
          lastUpdated: response.data.lastUpdated
        });

        setData(response.data.data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchData();
  }, [dateRange]);

  const [salesOptions, setSalesOptions] = useState({});
  const [salesSeries, setSalesSeries] = useState([]);
  const [salesDateRange, setSalesDateRange] = useState('all');
  const [salesAvailableRanges, setSalesAvailableRanges] = useState({
    '15d': true,
    '1m': true,
    '3m': true,
    '6m': true,
    '1a': true,
  });
  // --- Gráfica 2: Ventas ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/value/filtered?sort=ASC&startDate=2025-06-01&sensors=Sensor Temperatura Máxima,Sensor Temperatura Mínima, Sensor Temperatura Promedio');

        const sensorsData = response.data.data;

        // Obtener fechas únicas en orden
        const allDates = new Set();
        sensorsData.forEach(sensorGroup => {
          sensorGroup.values.forEach(v => allDates.add(v.date));
        });
        let sortedDates = Array.from(allDates).sort();

        // Calcular rangos disponibles
        const availableRanges = {
          '15d': sortedDates.length >= 15,
          '1m': sortedDates.length >= 30,
          '3m': sortedDates.length >= 90,
          '6m': sortedDates.length >= 180,
          '1a': sortedDates.length >= 365,
        };
        setSalesAvailableRanges(availableRanges);

        // Filtrar fechas según el rango seleccionado
        if (salesDateRange === '15d') {
          sortedDates = sortedDates.slice(-15);
        } else if (salesDateRange === '1m') {
          sortedDates = sortedDates.slice(-30);
        } else if (salesDateRange === '3m') {
          sortedDates = sortedDates.slice(-90);
        } else if (salesDateRange === '6m') {
          sortedDates = sortedDates.slice(-180);
        } else if (salesDateRange === '1a') {
          sortedDates = sortedDates.slice(-365);
        }

        // Armar series filtradas
        const series = sensorsData.map((sensorGroup, idx) => {
          const colorPalette = ["#1A56DB", "#7E3BF2", "#10B981", "#F59E0B"];
          const color = colorPalette[idx % colorPalette.length];

          const dateToValue = {};
          sensorGroup.values.forEach(v => {
            dateToValue[v.date] = v.value;
          });

          const data = sortedDates.map(date => dateToValue[date] ?? null);

          return {
            name: sensorGroup.sensor,
            data,
            color,
          };
        });

        setSalesOptions({
          chart: {
            height: "100%",
            maxWidth: "100%",
            type: "area",
            fontFamily: "Inter, sans-serif",
            toolbar: { show: false },
          },
          tooltip: { enabled: true, x: { show: false } },
          legend: { show: true },
          fill: {
            type: "gradient",
            gradient: {
              opacityFrom: 0.55,
              opacityTo: 0,
              shade: "#1450c9ff",
              gradientToColors: ["#1C64F2"],
            },
          },
          dataLabels: { enabled: false },
          stroke: { width: 6 },
          grid: { show: false },
          xaxis: {
            categories: sortedDates,
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
          yaxis: { show: true },
        });

        setSalesSeries(series);
      } catch (error) {
        console.error("Error al obtener datos para la gráfica:", error);
      }
    };
    fetchData();
  }, [salesDateRange]);

  // --- Gráfica 3: Leads ---
  const leadsOptions = {
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
  };



  // --- Gráfica 4: Profit/Income/Expense ---
  const profitOptions = {
    series: [
      {
        name: "Income",
        color: "#31C48D",
        data: [1420, 1620, 1820, 1420, 1650, 2120],
      },
      {
        name: "Expense",
        color: "#F05252",
        data: [788, 810, 866, 788, 1100, 1200],
      },
    ],
    chart: {
      type: "bar",
      height: 400,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    legend: { show: true, position: "bottom" },
    xaxis: {
      categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          colors: "#6B7280",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          colors: "#6B7280",
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (value) => `$${value}` },
    },
    grid: { strokeDashArray: 4 },
  };

  // --- Gráfica 5: Website traffic (Pie) ---
  const getPieChartOptions = () => ({
    options: {
      colors: ["#1C64F2", "#16BDCA", "#9061F9"],
      chart: {
        type: "pie",
        height: 420,
        width: "100%",
      },
      stroke: {
        colors: ["#fff"],
        lineCap: "round",
      },
      labels: ["Direct", "Organic search", "Referrals"],
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
    },
    series: [52.8, 26.8, 20.4],
  });

  // --- Gráfica 6: Visitors Overview (Line) ---
  const getLineChartOptions = () => ({
    options: {
      chart: {
        type: "line",
        height: 300,
        toolbar: { show: false },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      colors: ["#1C64F2"],
    },
    series: [
      {
        name: "Visitors",
        data: [10, 20, 15, 30, 40, 35, 50],
      },
    ],
  });

  // Inicializamos las gráficas dinámicas
  useEffect(() => {
    const pieData = getPieChartOptions();
    setPieOptions(pieData.options);
    setPieSeries(pieData.series);

    const lineData = getLineChartOptions();
    setLineOptions(lineData.options);
    setLineSeries(lineData.series);
  }, []);

  return (
    <div>
      {/* grafica 1 */}
      <div className="w-full p-4"> 
      <div className="bg-white rounded-lg shadow-lg border border-gray-300  p-4 md:p-6">
       <div className="flex justify-between">
          <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">
            {sensorInfo.sensor}
          </h5>
          <select
            name="dateRange"
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="border rounded px-3 py-2 text-xs cursor-pointer outline-none"
          >
            <option value="all">Filtrar por rango de tiempo</option>
            <option value="15d">Últimos 15 días</option>
            <option value="1m">Último mes</option>
            <option value="3m">Últimos 3 meses</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="1a">Último a;o</option>
          </select>
       </div>
          <p className="text-base font-normal text-gray-500">{sensorInfo.variable}</p>
          <div className="mt-4 object-contain">
            {usersSeries[0]?.data?.length > 0 && (
              <Chart
                options={usersOptions}
                series={usersSeries}
                type="area"
                height={300}
              />
              
            )}
            
          <div className="flex justify-end items-center m-auto text-xs text-gray-500 mb-2 w-full pr-3">
           <div className="w-[95%] flex justify-between">
             <span>
              {usersOptions.xaxis?.categories && usersOptions.xaxis.categories.length > 0
                ? usersOptions.xaxis.categories[0]
                : ''}
            </span>
            <span>
              {usersOptions.xaxis?.categories && usersOptions.xaxis.categories.length > 0
                ? usersOptions.xaxis.categories[usersOptions.xaxis.categories.length - 1]
                : ''}
            </span>
           </div>
          </div>

          </div>
          <div className="p-2 border-t order-gray-200 text-gray-400">
            <p>
              <i className="fa-solid fa-clock p-2"></i>
              {getRelativeTime(sensorInfo.lastUpdated)}
            </p>
          </div>
         
        </div>
      </div>

      <div className="w-full mt-6 p-4">
        {/* Tarjeta Sales */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
          <div className="flex justify-between">
            <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">
              Ventas
            </h5>
            <select
              name="salesDateRange"
              value={salesDateRange}
              onChange={e => setSalesDateRange(e.target.value)}
              className="border rounded px-3 text-xs cursor-pointer outline-none"
            >
              <option value="all">Filtrar por rango de tiempo</option>
              <option value="15d" disabled={!salesAvailableRanges['15d']}>Últimos 15 días</option>
              <option value="1m" disabled={!salesAvailableRanges['1m']}>Último mes</option>
              <option value="3m" disabled={!salesAvailableRanges['3m']}>Últimos 3 meses</option>
              <option value="6m" disabled={!salesAvailableRanges['6m']}>Últimos 6 meses</option>
              <option value="1a" disabled={!salesAvailableRanges['1a']}>Último a;o</option>
            </select>
          </div>
          <p className="text-base font-normal text-gray-500">Sales this week</p>
          <div className="mt-4">
            <Chart
              options={salesOptions}
              series={salesSeries}
              type="area"
              height={300}
            />
            {/* Fechas inicio y fin para gráfica 2 (Sales) */}
            <div className="flex justify-end items-center m-auto text-xs text-gray-500 mb-2 w-full pr-3">
              <div className="w-[95%] flex justify-between">
                <span>
                  {salesOptions.xaxis?.categories && salesOptions.xaxis.categories.length > 0
                    ? salesOptions.xaxis.categories[0]
                    : ''}
                </span>
                <span>
                  {salesOptions.xaxis?.categories && salesOptions.xaxis.categories.length > 1
                    ? salesOptions.xaxis.categories[salesOptions.xaxis.categories.length - 1]
                    : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="p-2 border-t order-gray-200 text-gray-400">
            <p>
              <i className="fa-solid fa-clock p-2"></i>
              {getRelativeTime(sensorInfo.lastUpdated)}
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 p-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
       
        {/* Tarjeta Leads */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
          <h5 className="leading-none text-2xl font-bold text-gray-900  pb-2">
            3.4k Leads
          </h5>
          <p className="text-sm font-normal text-gray-500 ">Generated per week</p>
          <div className="mt-4">
            <Chart
              options={leadsOptions}
              series={leadsOptions.series}
              type="bar"
              height={300}
            />
          </div>
          <div className="p-2 border-t order-gray-200 text-gray-400">
            <p>
              <i className="fa-solid fa-clock p-2"></i> updated 4 min ago
            </p>
          </div>
        </div>
      </div>

      {/* Cuarta gráfica Profit */}
      <div className="w-full mt-6 p-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
          <h5 className="text-2xl font-bold text-gray-900 pb-2">Profit Report</h5>
          <p className="text-base text-gray-500">
            Income vs Expense (last 6 months)
          </p>
          <div className="mt-4">
            <Chart
              options={profitOptions}
              series={profitOptions.series}
              type="bar"
              height={400}
            />
          </div>
        </div>
      </div>

      {/* Gráficas 5 y 6 */}
      <div className="flex mt-6 p-4 space-x-5">
        {/* PRIMERA GRÁFICA (Pie) */}
        <div className=" w-full bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-white p-4 md:p-6">
          <div className="flex justify-between items-start w-full mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Website traffic
            </h5>
          </div>
          <Chart options={pieOptions} series={pieSeries} type="pie" height={350} />
        </div>

        {/* SEGUNDA GRÁFICA (Line) */}
        <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 md:p-6">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white mb-4">
            Visitors Overview
          </h5>
          <Chart
            options={lineOptions}
            series={lineSeries}
            type="line"
            height={300}
          />
        </div>
      </div>

      {/* <div>
        <h1>Datos del backend:</h1>
          {data.map((seensorObj, index)=> (
            <div key={index} className='p-5'>
                <p>SENSOR: {seensorObj.sensor}</p>
                <p>CODE: {seensorObj.code}</p>
                {seensorObj.values.map((valueSensor, indexValue)=>(
                    <div key={indexValue}>
                      <p>VALUES: </p>
                      <li>Value: {JSON.stringify(valueSensor.value)}</li>
                      <li>Moment: {JSON.stringify(valueSensor.value)}</li>
                    </div>
                ))}
            </div> 
          ))}
        </div> */}
    </div>
  );
};
