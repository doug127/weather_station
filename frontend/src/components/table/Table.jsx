import React, { useState, useEffect } from "react";
import {api} from '../../api/apiRoutes'

const ITEMS_PER_PAGE = 10;

export const Table = () => {
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ min: "", max: "" });
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState(null);

  // 1️⃣ Obtener lista de sensores y luego traer sus datos filtrados
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Obtener sensores disponibles
        const sensorsResponse = await api.get("/sensor");
        const sensors = sensorsResponse.data.data;
        const sensorNames = sensors.map((s) => s.name);

        // 2. Calcular fechas por defecto (últimos 10 días)
        const today = new Date();
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(today.getDate() - 10);

        const startDateDefault = dateRange.min || tenDaysAgo.toISOString().split("T")[0];
        const endDateDefault = dateRange.max || today.toISOString().split("T")[0];

        const params = {
            sensors: sensorNames.join(","), // enviar lista de nombres
            startDate:  startDateDefault,
            endDate: endDateDefault,
            sort: "ASC",
        };

        // 2. Llamar endpoint filtrado con sensores y fechas
        const response = await api.get("/value/filtered", { params });

        // 3. Pivotear respuesta en formato tabla
        const sensorsData = response.data.data;
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
        setQueryParams(params); // parametros de consulta
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]); // 🔄 recarga cuando cambian las fechas

  

  // 3️⃣ Exportar a Excel
  const handleExport = async () => {
    try {
      if (!queryParams) return;

      const response = await api.get("/report/excel", {
        params: queryParams,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exportando Excel:", error);
    }
  };

  // 4️⃣ Paginación
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full p-5 flex space-x-5">
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg p-4 bg-white border border-gray-200 w-full">
        {/* Filtros */}
        <div className="w-full p-4 flex justify-between">
          <div className="space-x-2 flex">
            <div className="flex flex-col">
              <label htmlFor="date-start" className="text-center" >Fecha Inicio</label>
              <input
                type="date"
                id="date-start"
                value={dateRange.min}
                onChange={(e) => setDateRange({ ...dateRange, min: e.target.value })}
                className="border p-2"
                max={dateRange.max || undefined}
              />
                
            </div>
            <div className="flex flex-col">
              <label htmlFor="date-end" className="text-center">Fecha Fin</label>
              <input
                type="date"
                id="date-end"
                value={dateRange.max}
                onChange={(e) => setDateRange({ ...dateRange, max: e.target.value })}
                className="border p-2"
                min={dateRange.min || undefined}
              />
            </div>
          </div>
          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-3 py-2 rounded"
          >
            Exportar Excel
          </button>
        </div>

        {/* Tabla */}
        {loading ? (
          <p className="text-center py-4">Cargando datos...</p>
        ) : (
          <table className="w-full text-sm text-left bg-white">
            <thead className="text-xs text-gray-700 uppercase bg-white">
              <tr className="font-bold">
                {headers.map((h, i) => (
                  <th key={i} className="px-6 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, i) => (
                <tr
                  key={i}
                  className="bg-white border-b hover:bg-gray-200 cursor-pointer"
                >
                  {headers.map((h, j) => (
                    <td key={j} className="px-6 py-4">
                      {row[h] !== undefined ? row[h] : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Paginación */}
        <div className="flex justify-end mt-4 space-x-2">
          {/* Ir al inicio */}
          <button
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            Inicio
          </button>

          {/* Anterior */}
          <button
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          {/* Números dinámicos */}
          {(() => {
            const pages = [];
            const maxButtons = 5;
            let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
            let end = start + maxButtons - 1;

            if (end > totalPages) {
              end = totalPages;
              start = Math.max(1, end - maxButtons + 1);
            }

            for (let i = start; i <= end; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === i ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                >
                  {i}
                </button>
              );
            }

            return pages;
          })()}

          {/* Siguiente */}
          <button
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>

          {/* Ir al final */}
          <button
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Último
          </button>
        </div>
      </div>
    </div>
  );
};