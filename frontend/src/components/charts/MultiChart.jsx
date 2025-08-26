import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { api } from "../../api/apiRoutes";

export const MultiChart = ({ dateLastYear, excludedSensors }) => {
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);
  const [salesDateRange, setSalesDateRange] = useState("all");
  const [availableSensors, setAvailableSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("");

  // 🔹 Cargar lista de sensores desde la DB
  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const res = await api.get(`/sensor`); 
        const sensors = res.data.data.map((s) => s.name); 
        const filteredSensors = sensors.filter(
          (sensor) => !excludedSensors.includes(sensor)
        );

        setAvailableSensors(filteredSensors);
        if (filteredSensors.length > 0) {
          setSelectedSensor(filteredSensors[0]);
        }
      } catch (error) {
        console.error("Error fetching sensors:", error);
      }
    };
    fetchSensors();
  }, [excludedSensors]);

  // 🔹 Cargar datos de los sensores seleccionados
  useEffect(() => {
    if (!selectedSensor) return;

    const fetchData = async () => {
      try {
        const response = await api.get(
          `/value/filtered?startDate=${dateLastYear}&sensor=${selectedSensor}&sort=ASC`
        );

        const sensorData = response.data.data[0];

        // Obtener todos los timestamps ordenados
        let timestamps = sensorData.values.map((v) => v.timestamp).sort((a,b) => new Date(a) - new Date(b));

        // Aplicar rango
        if (salesDateRange === "15d") timestamps = timestamps.slice(-15);
        else if (salesDateRange === "1m") timestamps = timestamps.slice(-30);
        else if (salesDateRange === "3m") timestamps = timestamps.slice(-90);
        else if (salesDateRange === "6m") timestamps = timestamps.slice(-180);
        else if (salesDateRange === "1a") timestamps = timestamps.slice(-365);


        const dateMap = Object.fromEntries(
          sensorData.values.map((v) => [v.timestamp, v.value])
        );

        const data = timestamps.map((ts) => ({
          x: new Date(ts).getTime(),
          y: dateMap[ts] ?? null,
        }));

        setSeries([{ name: sensorData.sensor, data, color: "#1A56DB"}]);

        setOptions({
          chart: {
            type: "area",
            height: "100%",
            fontFamily: "Inter, sans-serif",
            toolbar: { show: false },
          },
          tooltip: {
            enabled: true,
            x: {
              formatter: (value) =>
                new Date(value).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                }),
            },
          },
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
          stroke: { width: 3 },
          grid: { show: false },
          xaxis: {
            type: "datetime",
            labels: {
              formatter: (value) =>
                new Date(value).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                }),
            },
          },
          yaxis: { show: true },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [salesDateRange, selectedSensor, dateLastYear]);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">
          Otros Sensores
        </h5>

        {/* 🔹 Selector de tiempo */}
        <select
          value={salesDateRange}
          onChange={(e) => setSalesDateRange(e.target.value)}
          className="border rounded px-3 text-xs cursor-pointer outline-none"
        >
          <option value="all">Todos</option>
          <option value="15d">Últimos 15 días</option>
          <option value="1m">Último mes</option>
          <option value="3m">Últimos 3 meses</option>
          <option value="6m">Últimos 6 meses</option>
          <option value="1a">Último año</option>
        </select>

        {/* 🔹 Selector de sensores */}
        <select
          value={selectedSensor}
          onChange={(e) =>
            setSelectedSensor(e.target.value)
          }
          className="border rounded px-3 text-xs cursor-pointer outline-none h-24"
        >
          {availableSensors.map((sensor) => (
            <option key={sensor} value={sensor}>
              {sensor}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <Chart options={options} series={series} type="area" height={350} />
      </div>
    </div>
  );
};
