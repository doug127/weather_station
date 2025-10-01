import { useState, useEffect } from "react";
import { api } from "@/shared/api/apiRoutes";

export const useSingleChart = ({
  sensor,
  dateLastYear,
  options = {}
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

  const getDateRange = () => {
    const endDate = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case "15d": startDate.setDate(endDate.getDate() - 15); break;
      case "1m": startDate.setMonth(endDate.getMonth() - 1); break;
      case "3m": startDate.setMonth(endDate.getMonth() - 3); break;
      case "6m": startDate.setMonth(endDate.getMonth() - 6); break;
      case "1a": startDate.setFullYear(endDate.getFullYear() - 1); break;
      case "all": default: startDate = new Date(dateLastYear); break;
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

      // Convertir valores a timestamp y value
      const originalData = sensorData.values
        .filter(v => v.timestamp)
        .map(v => ({
          x: new Date(v.timestamp).getTime(),
          y: parseFloat(v.value) || 0
        }));

      const minDate = originalData[0].x;
      const maxDate = originalData[originalData.length - 1].x;

      // Generar timestamps uniformes para el eje X (12 puntos)
      const tickAmount = 12;
      const step = (maxDate - minDate) / (tickAmount - 1);
      const uniformX = Array.from({ length: tickAmount }, (_, i) => minDate + step * i);

      // Interpolar los valores del sensor sobre los timestamps uniformes
      const interpolatedData = uniformX.map(x => {
        // Buscar el valor más cercano
        let nearest = originalData.reduce((prev, curr) =>
          Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev
        );
        return { x, y: nearest.y };
      });

      setSeries([{ name: sensorData.sensor, data: interpolatedData, color: "#1A56DB" }]);
      setSensorInfo({
        sensor: sensorData.sensor,
        variable: sensorData.variable,
        unit: sensorData.unit,
        lastUpdated: response.data.lastUpdated
      });

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
          tickAmount: tickAmount - 1,
          labels: { formatter: val => new Date(val).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }) }
        },
        yaxis: { show: true }
      });

      console.log(`Single chart processed: ${interpolatedData.length} uniform data points`);

    } catch (err) {
      console.error("Error fetching single chart data:", err);
      setError(err.message);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => { if (sensor) fetchData(); }, [dateRange, sensor, dateLastYear]);

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
