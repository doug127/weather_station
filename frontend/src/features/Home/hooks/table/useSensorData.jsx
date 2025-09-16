import { useEffect, useState } from "react";
import {api} from "@/shared/api/apiRoutes";

export const useSensorsData = (dateRange) => {
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Sensores disponibles
        const sensorsResponse = await api.get("/sensor");
        const sensors = sensorsResponse.data.data;
        const sensorNames = sensors.map((s) => s.name);

        // 2. Fechas por defecto
        const today = new Date();
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(today.getDate() - 10);

        const startDateDefault =
          dateRange.min || tenDaysAgo.toISOString().split("T")[0];
        const endDateDefault =
          dateRange.max || today.toISOString().split("T")[0];

        const params = {
          sensors: sensorNames.join(","),
          startDate: startDateDefault,
          endDate: endDateDefault,
          sort: "ASC",
        };

        // 3. Datos filtrados
        const response = await api.get("/value/filtered", { params });
        const sensorsData = response.data.data;

        // 4. Pivotear
        const pivot = {};
        sensorsData.forEach((sensor) => {
          sensor.values.forEach(({ timestamp, value }) => {
            const date = timestamp.split("T")[0];
            if (!pivot[date]) pivot[date] = { date };
            pivot[date][sensor.code] = value;
          });
        });

        const rows = Object.values(pivot).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setHeaders(["date", ...sensorsData.map((s) => s.code)]);
        setData(rows);
        setFilteredData(rows);
        setQueryParams(params);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return { headers, data, filteredData, loading, queryParams };
};
