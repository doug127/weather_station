import { useState, useEffect } from "react";
import { api } from "@/shared/api/apiRoutes";

export const useSingleChart = ({
  sensor,
  dateLastYear,
  options = {},
  tickAmount: initialTickAmount = 13
}) => {
  const [chartOptions, setChartOptions] = useState({});
  const [series, setSeries] = useState([]);
  const [sensorInfo, setSensorInfo] = useState({
    sensor: "",
    variable: "",
    unit: "",
    lastUpdated: ""
  });
  const [dateRange, setDateRange] = useState("15d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tickAmount, setTickAmount] = useState(initialTickAmount); // ✅ ahora es dinámico

  useEffect(() => {
    const updateTickAmount = () => {
      if (window.innerWidth <  1024) setTickAmount(6);      // móviles
      else setTickAmount(13);                             // escritorio
    };

    updateTickAmount(); // 👈 se ejecuta inmediatamente al montar
    window.addEventListener("resize", updateTickAmount);
    return () => window.removeEventListener("resize", updateTickAmount);
  }, []);

  const getDateRange = () => {
    const endDate = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case "15d": startDate.setDate(endDate.getDate() - 15); break;
      case "1m": startDate.setMonth(endDate.getMonth() - 1); break;
      case "3m": startDate.setMonth(endDate.getMonth() - 3); break;
      case "6m": startDate.setMonth(endDate.getMonth() - 6); break;
      case "1a": startDate.setFullYear(endDate.getFullYear() - 1); break;
      case "all":
      default: startDate = new Date(dateLastYear); break;
    }

    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { startDate, endDate } = getDateRange();

      const response = await api.get(`/value/filtered`, {
        params: { sensor, startDate, endDate, sort: "ASC", ...options }
      });

      const sensorData = response.data.data[0];
      if (!sensorData || !sensorData.values.length) {
        setSeries([]);
        setSensorInfo({ sensor: "", variable: "", unit: "", lastUpdated: "" });
        return;
      }

      const originalData = sensorData.values
        .filter(v => v.timestamp)
        .map(v => ({
          x: new Date(v.timestamp).getTime(),
          y: parseFloat(v.value) || 0
        }));

      const minDate = originalData[0].x;
      const maxDate = originalData[originalData.length - 1].x;

      setSeries([{ 
        name: sensorData.sensor, 
        data: originalData, 
        color: "#1A56DB" 
      }]);

      setSensorInfo({
        sensor: sensorData.sensor,
        variable: sensorData.variable,
        unit: sensorData.unit,
        lastUpdated: response.data.lastUpdated
      });

      // Calcular ticks según el tamaño de pantalla detectado
      const tickCount = tickAmount || 13;
      const tickPositions = Array.from({ length: tickCount }, (_, i) => 
        minDate + ((maxDate - minDate) / (tickCount - 1)) * i
      );

      setChartOptions({
        chart: { type: "area", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
        tooltip: {
          enabled: true,
          x: { formatter: val => new Date(val).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }) }
        },
        fill: { type: "gradient", gradient: { shade: "light", opacityFrom: 0.75, opacityTo: 0, gradientToColors: ["#164cb7ff"] } },
        dataLabels: { enabled: false },
        stroke: { width: 3 },
        grid: { show: false },
        xaxis: {
          type: "datetime",
          min: minDate,
          max: maxDate,
          tickAmount: tickCount - 1,
          labels: { formatter: val => new Date(val).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }) },
          tickPlacement: "on",
          tickPositions
        },
        yaxis: { show: true }
      });
    } catch (err) {
      console.error("Error fetching single chart data:", err);
      setError(err.message);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Ejecutar fetchData después de conocer tickAmount inicial
  useEffect(() => {
    if (sensor && tickAmount) fetchData();
  }, [dateRange, sensor, dateLastYear, tickAmount]);

  // 🔹 Actualizar los ticks dinámicamente sin hacer fetch
  useEffect(() => {
    if (!chartOptions.xaxis) return;

    const { min, max } = chartOptions.xaxis;
    if (!min || !max) return;

    const tickCount = tickAmount || 13;
    const newTickPositions = Array.from({ length: tickCount }, (_, i) =>
      min + ((max - min) / (tickCount - 1)) * i
    );

    setChartOptions((prev) => ({
      ...prev,
      xaxis: {
        ...prev.xaxis,
        tickAmount: tickCount - 1,
        tickPositions: newTickPositions,
      },
    }));
  }, [tickAmount]);

  return {
    chartOptions,
    series,
    sensorInfo,
    dateRange,
    loading,
    error,
    setDateRange,
    refetch: fetchData
  };
};
