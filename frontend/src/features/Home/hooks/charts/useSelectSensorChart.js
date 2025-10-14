import { useEffect, useState } from "react";
import { api } from "@/shared/api/apiRoutes";

export const useSelectSensorChart = ({ dateLastYear, excludedSensors = [], tickAmount = 13 }) => {
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);
  const [salesDateRange, setSalesDateRange] = useState("15d");
  const [availableSensors, setAvailableSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Función para calcular rango dinámico
  const getDateRange = () => {
    const endDate = new Date();
    let startDate = new Date();

    switch (salesDateRange) {
      case "15d":
        startDate.setDate(endDate.getDate() - 15);
        break;
      case "1m":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "3m":
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "6m":
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "1a":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case "all":
      default:
        startDate = new Date(dateLastYear);
        break;
    }

    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
  };

  // 🔹 Obtener lista de sensores
  useEffect(() => {
    const fetchSensors = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/sensor`);
        const sensors = res.data.data.map((s) => s.name);
        const filteredSensors = sensors.filter((sensor) => !excludedSensors.includes(sensor));
        setAvailableSensors(filteredSensors);
        if (filteredSensors.length > 0) setSelectedSensor(filteredSensors[0]);
      } catch (err) {
        console.error("Error fetching sensors:", err);
        setError("No se pudieron cargar los sensores");
      } finally {
        setLoading(false);
      }
    };
    fetchSensors();
  }, [excludedSensors]);

  // 🔹 Cargar datos del sensor seleccionado desde el backend
  useEffect(() => {
    if (!selectedSensor) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { startDate, endDate } = getDateRange();
        const response = await api.get(`/value/filtered`, {
          params: { sensor: selectedSensor, startDate, endDate, sort: "ASC" },
        });

        const sensorData = response.data.data[0];
        if (!sensorData || !sensorData.values?.length) {
          setSeries([]);
          return;
        }

        const data = sensorData.values.map((v) => ({
          x: new Date(v.timestamp).getTime(),
          y: v.value ?? null,
        }));

        const minDate = data[0].x;
        const maxDate = data[data.length - 1].x;

        setSeries([{ name: sensorData.sensor, data, color: "#1A56DB" }]);

        // Calcular tickPositions iniciales
        const tickCount = tickAmount || 13;
        const tickPositions = Array.from({ length: tickCount }, (_, i) => 
          minDate + ((maxDate - minDate) / (tickCount - 1)) * i
        );

        // Configuración inicial del chart
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
                new Date(value).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
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
            min: minDate,
            max: maxDate,
            tickAmount: tickCount - 1,
            labels: {
              formatter: (value) =>
                new Date(value).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
            },
            tickPlacement: "on",
            tickPositions: tickPositions,
          },
          yaxis: { show: true },
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("No se pudieron cargar los datos del sensor");
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [salesDateRange, selectedSensor, dateLastYear]);

  // 🔹 Actualizar solo el tickAmount sin volver a hacer fetch
  useEffect(() => {
    if (!options.xaxis) return;

    const { min, max } = options.xaxis;
    if (!min || !max) return;

    const tickCount = tickAmount || 13;
    const newTickPositions = Array.from({ length: tickCount }, (_, i) => 
      min + ((max - min) / (tickCount - 1)) * i
    );

    setOptions((prev) => ({
      ...prev,
      xaxis: {
        ...prev.xaxis,
        tickAmount: tickCount - 1,
        tickPositions: newTickPositions,
      },
    }));
  }, [tickAmount]); // ✅ Solo depende de tickAmount, no de options.xaxis

  return {
    options,
    series,
    salesDateRange,
    setSalesDateRange,
    availableSensors,
    selectedSensor,
    setSelectedSensor,
    loading,
    error,
  };
};
