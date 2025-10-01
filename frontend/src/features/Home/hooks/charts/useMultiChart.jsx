import { useState, useEffect } from 'react';
import { api } from '@/shared/api/apiRoutes';

/**
 * Hook para gráficos de múltiples sensores siguiendo la lógica original del TempChart
 * @param {Object} config - Configuración del hook
 * @param {string[]} config.sensors - Array de nombres de sensores
 * @param {string} config.dateLastYear - Fecha de fallback para obtener datos base
 * @param {Object} config.options - Opciones adicionales para la API
 * @returns {Object} Estado y funciones del hook
 */
export const useMultiChart = ({
  sensors,
  dateLastYear,
  options = {}
}) => {
  const [chartOptions, setChartOptions] = useState({});
  const [series, setSeries] = useState([]);
  const [dateRange, setDateRange] = useState('15d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDateRange = () => {
    const endDate = new Date();
    let startDate = new Date();

    switch (dateRange) {
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
  }

  useEffect(() => {
    const fetchTempData = async () => {
      try {
        setLoading(true);
        setError(null);

        const sensorsParam = sensors.join(",");
        const { startDate, endDate } = getDateRange();
        const response = await api.get(`/value/filtered`, {
          params: {
            sensors: sensorsParam,
            startDate,
            endDate,
            sort: "ASC",
            ...options
          }
        });
        const sensorsData = response.data.data;
        
        const allTimestamps = Array.from(
          new Set(
            sensorsData.flatMap((sd) => 
              sd.values.map((v) => v.timestamp).filter(Boolean)
            )
          )
        ).sort((a, b) => new Date(a) - new Date(b));

        let filteredTimestamps = [...allTimestamps];
        if (dateRange === '15d') filteredTimestamps = filteredTimestamps.slice(-15);
        else if (dateRange === '1m') filteredTimestamps = filteredTimestamps.slice(-30);
        else if (dateRange === '3m') filteredTimestamps = filteredTimestamps.slice(-90);
        else if (dateRange === '6m') filteredTimestamps = filteredTimestamps.slice(-180);
        else if (dateRange === '1a') filteredTimestamps = filteredTimestamps.slice(-365);

        const seriesData = sensorsData.map((sensorGroup, idx) => {
          const colors = ["#1A56DB", "#7E3BF2", "#10B981", "#F59E0B"];
          const color = colors[idx % colors.length];
          const dateMap = Object.fromEntries(
            sensorGroup.values.map((v) => [v.timestamp, v.value])
          );

          const data = filteredTimestamps.map((ts) => ({
            x: new Date(ts).getTime(),
            y: dateMap[ts] || null
          })); 
          
          return { name: sensorGroup.sensor, data, color };
        });

        setSeries(seriesData);
        
        const minDate = new Date(filteredTimestamps[0]).getTime();
        const maxDate = new Date(filteredTimestamps[filteredTimestamps.length - 1]).getTime();

        setChartOptions({
          chart: { 
            type: "area", 
            height: "100%", 
            fontFamily: "Inter, sans-serif", 
            toolbar: { show: false } 
          },
          tooltip: { 
            enabled: true, 
            x: { show: false } 
          },
          fill: { 
            type: "gradient", 
            gradient: { 
              opacityFrom: 0.55, 
              opacityTo: 0, 
              shade: "#1450c9ff", 
              gradientToColors: ["#1C64F2"] 
            } 
          },
          dataLabels: { enabled: false },
          stroke: { width: 3 },
          grid: { show: false },
          xaxis: { 
            type: "datetime",
            min: minDate,
            max: maxDate,
            labels: {
              formatter: (value) => {
                return new Date(value).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit"
                });
              },
              show: false
            } 
          },
          yaxis: { show: true },
        });

      } catch (err) {
        console.error("Error fetching temp data:", err);
        setError(err.message);
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    if (sensors && sensors.length > 0) {
      fetchTempData();
    }
  }, [dateRange, dateLastYear, sensors]);

  return {
    // Estado
    chartOptions,
    series,
    dateRange,
    loading,
    error,
    
    // Funciones
    setDateRange,
    refetch: () => {
      // Re-ejecutar el useEffect
      setLoading(true);
    }
  };
};