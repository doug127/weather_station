import React, { useState } from "react";
import { useSensorsData } from "@/features/Home/hooks/table/useSensorData";
import { useExportExcel } from "@/features/Home/hooks/table/useExportExcel";
import { ButtonPagination, Button } from "@/shared/components/buttons/Button";
import { InputDate } from "../components/forms/inputs/InputDate";

const ITEMS_PER_PAGE = 10;

export const Table = () => {
  const today = new Date();
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(today.getDate() - 10);

  const [dateRange, setDateRange] = useState({
    min: tenDaysAgo.toISOString().split("T")[0],
    max: today.toISOString().split("T")[0],
  });

  const [currentPage, setCurrentPage] = useState(1);

  const { headers, data, filteredData, loading, queryParams } =
    useSensorsData(dateRange);

  const { handleExport } = useExportExcel(queryParams);


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
            <InputDate dateRange={dateRange} setDateRange={setDateRange} id="date-start" />
            <InputDate dateRange={dateRange} setDateRange={setDateRange} id="date-end" />
          </div>
          <Button
            onClick={handleExport}
          >
            Exportar Excel
          </Button>
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
          <ButtonPagination
            onClick={() => setCurrentPage(1)}
            currentPage={currentPage}
            totalPages={1}
          >
            Inicio
          </ButtonPagination>
          {/* Anterior */}
          <ButtonPagination
            onClick={() => setCurrentPage((p) => p - 1)}
            currentPage={currentPage}
            totalPages={1}
          >
            Anterior
          </ButtonPagination>

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
          <ButtonPagination
            onClick={() => setCurrentPage((p) => p + 1)}
            currentPage={currentPage}
            totalPages={totalPages}
          >
            Siguiente
          </ButtonPagination>
          {/* Ir al final */}
          <ButtonPagination
            onClick={() => setCurrentPage(totalPages)}
            currentPage={currentPage}
            totalPages={totalPages}
          >
            Último
          </ButtonPagination>
        </div>
      </div>
    </div>
  );
};