import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSensorsData } from "@/features/Home/hooks/table/useSensorData";
import { useExportExcel } from "@/features/Home/hooks/table/useExportExcel";
import { useEditableTable } from "@/features/Home/hooks/table/useEditableTable";
import { ButtonPagination } from "@/shared/components/buttons/ButtonPagination";
import { Button } from "@/shared/components/buttons/Button"
import { ToggleButton } from "@/shared/components/buttons/ToggleButton";
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

  const { headers, filteredData, loading, queryParams } = useSensorsData(dateRange);
  const { handleExport } = useExportExcel(queryParams);

  // Hook de tabla editable CON FUNCIÓN DE DEBUG
  const {
    editMode,
    setEditMode,
    tableData,
    editedRows,
    toggleEditMode,
    updateCell,
    acceptRowChanges,
    updateAllRows,
    setTableData,
    getCellValue,
    debugTableState
  } = useEditableTable(filteredData);

  // 4️⃣ Paginación
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // 🔹 Resetear página si cambian los datos
  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredData, totalPages, currentPage]);

  // 🔹 Función para manejar el cambio de modo
  const handleModeChange = (mode) => {
    const isEditMode = mode === "Edición";
    setEditMode(isEditMode);
  };

  const handleUpdateAllRows = async () => {
    try {
      await updateAllRows();
      
    } catch (error) {
      console.error("❌ Error al guardar todas:", error);
    }
  };

  return (
    <div className="min-w-full min-h-[75vh] p-5">
      {/* ✅ CONTENEDOR CON SCROLL HORIZONTAL CONTROLADO */}
      <div className="relative w-full md:max-w-[calc(100vw-30vw)] lg:max-w-[calc(100vw-30vw)] overflow-x-auto shadow-lg sm:rounded-lg p-4 bg-white border border-gray-200">
        
        {/* ✅ FILTROS CON RESPONSIVE MEJORADO */}
        {/* ✅ FILTROS CON RESPONSIVE MEJORADO */}
        <div className="w-full p-4">
          <div className="flex flex-col md:flex-row w-full items-start xl:items-center justify-between gap-4">
            
            {/* Grupo de filtros de fecha */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-0 md:flex-col lg:flex-row">
              <InputDate
                dateRange={dateRange}
                setDateRange={setDateRange}
                id="date-start"
              />
              <InputDate
                dateRange={dateRange}
                setDateRange={setDateRange}
                id="date-end"
              />
            </div>

            {/* Grupo de controles */}
            <div className="flex flex-col md:flex-col md:flex-row items-start md:items-stretch gap-2 w-full sm:w-auto">
              
              {/* Toggle de edición */}
              <div className="flex w-full sm:w-48 lg:w-60 bg-gray-200 rounded-full p-1 relative order-1 md:order-none">
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="absolute h-[calc(100%-0.5rem)] w-1/2 bg-gray-900 rounded-full"
                  style={{
                    left: !editMode ? "0.25rem" : "calc(50% - 0.25rem)",
                  }}
                />
                <button
                  onClick={() => handleModeChange("Normal")}
                  className={`relative z-10 w-1/2 text-center py-2 font-medium rounded-full transition-colors text-sm ${
                    !editMode ? "text-white" : "text-gray-600"
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => handleModeChange("Edición")}
                  className={`relative z-10 w-1/2 text-center py-2 font-medium rounded-full transition-colors text-sm ${
                    editMode ? "text-white" : "text-gray-600"
                  }`}
                >
                  Edición
                </button>

                
              </div>
            </div>
          </div>
        </div>


        {/* ✅ TABLA CON SCROLL HORIZONTAL INTERNO */}
        {loading ? (
          <p className="text-center py-4">Cargando datos...</p>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-4 text-gray-600">No hay datos disponibles para el rango de fechas seleccionado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left bg-white">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
                <tr className="font-bold">
                  {headers.map((h, i) => {
                    const isDateTimeColumn = h.toLowerCase().includes('date') || h.toLowerCase().includes('time') || h.toLowerCase() === 'datetime';
                    return (
                      <th key={i} className="px-4 py-3 min-w-[100px] max-w-[200px] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="truncate font-medium">{h}</span>
                          {editMode && (
                            <span className="text-xs flex-shrink-0">
                              {isDateTimeColumn ? (
                                <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[9px]">
                                  ÍNDICE
                                </span>
                              ) : (
                                <span className="bg-green-200 text-green-700 px-1.5 py-0.5 rounded text-[9px]">
                                  EDIT
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, i) => {
                  const globalRowIndex = startIndex + i;
                  
                  return (
                    <tr key={globalRowIndex} className="odd:bg-white even:bg-gray-50 border-b hover:bg-gray-100">
                      {headers.map((h, j) => {
                        const isDateTimeColumn = h.toLowerCase().includes('date') || h.toLowerCase().includes('time') || h.toLowerCase() === 'datetime';
                        
                        return (
                          <td key={j} className="px-4 py-3 min-w-[100px] max-w-[200px]">
                            {editMode && !isDateTimeColumn ? (
                              <input
                                type="text"
                                value={getCellValue(globalRowIndex, h)}
                                onChange={(e) => {
                                  console.log(`📝 Cambiando valor: Fila ${globalRowIndex}, Col ${h}, Valor: ${e.target.value}`);
                                  updateCell(globalRowIndex, h, e.target.value);
                                }}
                                // onFocus={() => debugComponent("INPUT FOCUS", globalRowIndex, h)}
                                className="border border-gray-300 px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder={`Editar ${h}`}
                              />
                            ) : (
                              <div className={`${isDateTimeColumn ? "text-gray-600 font-mono text-xs" : "text-sm"} truncate`} 
                                   title={getCellValue(globalRowIndex, h)}
                              >
                                {getCellValue(globalRowIndex, h) || "-"}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ PAGINACIÓN RESPONSIVE */}
        {totalPages > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
            
            {/* Info de paginación */}
            <div className="text-sm text-gray-600">
              Mostrando {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} de {filteredData.length} registros
            </div>
            
            {/* Controles de paginación */}
            <div className="flex flex-wrap justify-center gap-1">
              <ButtonPagination
                onClick={() => {
                  setCurrentPage(1);
                  debugComponent("CAMBIO A PÁGINA 1");
                }}
                currentPage={currentPage}
                totalPages={totalPages}
                disabled={currentPage <= 1}
              >
                <span className="hidden sm:inline">Inicio</span>
                <span className="sm:hidden">««</span>
              </ButtonPagination>
              
              <ButtonPagination
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  debugComponent("PÁGINA ANTERIOR");
                }}
                currentPage={currentPage}
                totalPages={totalPages}
                disabled={currentPage <= 1}
              >
                <span className="hidden sm:inline">Anterior</span>
                <span className="sm:hidden">«</span>
              </ButtonPagination>

              {/* Números de página */}
              {(() => {
                const pages = [];
                const maxButtons = typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 5;
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
                      onClick={() => {
                        setCurrentPage(i);
                        debugComponent(`CAMBIO A PÁGINA ${i}`);
                      }}
                      className={`px-3 py-1 text-sm rounded min-w-[2.5rem] ${
                        currentPage === i ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                return pages;
              })()}

              <ButtonPagination
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  debugComponent("PÁGINA SIGUIENTE");
                }}
                currentPage={currentPage}
                totalPages={totalPages}
                disabled={currentPage >= totalPages}
              >
                <span className="hidden sm:inline">Siguiente</span>
                <span className="sm:hidden">»</span>
              </ButtonPagination>
              
              <ButtonPagination
                onClick={() => {
                  setCurrentPage(totalPages);
                  debugComponent(`CAMBIO A ÚLTIMA PÁGINA ${totalPages}`);
                }}
                currentPage={currentPage}
                totalPages={totalPages}
                disabled={currentPage >= totalPages}
              >
                <span className="hidden sm:inline">Último</span>
                <span className="sm:hidden">»»</span>
              </ButtonPagination>
            </div>
          </div>
        )}

        {/* ✅ BOTÓN GUARDAR TODOS */}
        {editMode && Object.keys(editedRows).length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md sticky bottom-0 z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <p className="text-sm text-blue-700">
                Tienes {Object.keys(editedRows).length} fila(s) con cambios pendientes
              </p>
              <button
                onClick={handleUpdateAllRows}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap w-full sm:w-auto"
              >
                Guardar todos los cambios
              </button>
            </div>
          </div>
        )}

        {/* ✅ Panel de debug con ancho controlado */}
        

        {/* Botón Exportar */}
          <div className="flex justify-end mt-2 mr-6">
            {editMode && (
              <div className="my-4 p-3 bg-yellow-50 border border-yellow-200 rounded max-w-full overflow-hidden">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <span className="text-xs text-yellow-700 break-words">
                    Filas editadas: {Object.keys(editedRows).length} | 
                    Página: {currentPage}/{totalPages} |
                    Filas totales: {filteredData.length}
                  </span>
                </div>
              </div>
            )}
            <button
                onClick={handleExport}
                className="bg-gray-800 md:mt-4 text-white py-2 px-4 h-10 rounded-md hover:bg-gray-700 transition-colors whitespace-nowrap flex-shrink-0 order-2 md:order-none"
              >
                Exportar
              </button>
          </div>
      </div>
    </div>
  );
};