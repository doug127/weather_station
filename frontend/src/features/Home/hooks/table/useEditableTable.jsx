import { useState, useEffect } from "react";
import { api } from "@/shared/api/apiRoutes"; 

export const useEditableTable = (initialData = []) => {
  const [editMode, setEditMode] = useState(false);
  const [tableData, setTableData] = useState(initialData);
  const [editedRows, setEditedRows] = useState({}); // {rowIndex: {...col:value}}

  useEffect(() => {
    setTableData(initialData);
    setEditedRows({});
  }, [initialData]);

  const toggleEditMode = () => setEditMode((prev) => !prev);

  // ✅ detectar columnas de fecha/hora
  const isDateTimeColumn = (columnName) => {
    const name = columnName.toLowerCase();
    return (
      name.includes("date") ||
      name.includes("time") ||
      name === "datetime" ||
      name === "timestamp"
    );
  };

  // ✅ solo permitir edición en columnas que no sean fecha
  const updateCell = (rowIndex, key, value) => {
    if (isDateTimeColumn(key)) {
      console.warn(`Columna ${key} es solo lectura (datetime index)`);
      return;
    }

    setEditedRows((prev) => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [key]: value,
      },
    }));
  };

  // ✅ obtener el "timestamp" como identificador único de fila
  const getRowTimestamp = (row) => {
    return row.date || row.datetime || row.timestamp;
  };

  // Guardar cambios de UNA fila - VERSIÓN CORREGIDA
  const acceptRowChanges = async (rowIndex) => {
    if (!editedRows[rowIndex]) return;

    const changes = editedRows[rowIndex]; // { code1: val1, code2: val2 }
    const currentRow = tableData[rowIndex];
    const timestamp = getRowTimestamp(currentRow);

    if (!timestamp) {
      console.error("No se encontró timestamp en la fila");
      return;
    }

    try {
      // 🔄 enviar UN PATCH por cada columna editada en la fila
      const updates = Object.entries(changes).map(([code, value]) =>
        api.patch(`/value/update`, {
          timestamp,
          code,
          value,
        })
      );

      await Promise.all(updates);

      // ✅ ACTUALIZAR INMEDIATAMENTE EL ESTADO LOCAL
      setTableData((prevTableData) => {
        const newTableData = [...prevTableData];
        const updatedRow = { ...newTableData[rowIndex] };
        
        // Aplicar todos los cambios a la fila
        Object.entries(changes).forEach(([key, value]) => {
          updatedRow[key] = value;
        });
        
        newTableData[rowIndex] = updatedRow;
        return newTableData;
      });

      // limpiar cambios de esta fila
      setEditedRows((prev) => {
        const { [rowIndex]: removed, ...rest } = prev;
        return rest;
      });

      console.log(`Fila ${rowIndex} actualizada correctamente`, changes);
    } catch (error) {
      console.error("Error al actualizar fila:", error);
    }
  };

  // Guardar cambios de TODAS las filas - VERSIÓN CORREGIDA
  const updateAllRows = async () => {
    if (Object.keys(editedRows).length === 0) {
      console.warn("No hay cambios pendientes");
      return;
    }

    try {
      const requests = [];

      Object.keys(editedRows).forEach((rowIndex) => {
        const changes = editedRows[rowIndex];
        const currentRow = tableData[rowIndex];
        const timestamp = getRowTimestamp(currentRow);

        if (!timestamp) {
          throw new Error(`No se encontró timestamp para fila ${rowIndex}`);
        }

        // 🔄 un request por cada columna editada
        Object.entries(changes).forEach(([code, value]) => {
          requests.push(
            api.patch(`/value/update`, { timestamp, code, value })
          );
        });
      });

      await Promise.all(requests);

      // ✅ ACTUALIZAR INMEDIATAMENTE EL ESTADO LOCAL
      setTableData((prevTableData) => {
        const newTableData = [...prevTableData];
        
        Object.keys(editedRows).forEach((rowIndex) => {
          const rowIdx = parseInt(rowIndex);
          const changes = editedRows[rowIndex];
          
          if (newTableData[rowIdx]) {
            const updatedRow = { ...newTableData[rowIdx] };
            Object.entries(changes).forEach(([key, value]) => {
              updatedRow[key] = value;
            });
            newTableData[rowIdx] = updatedRow;
          }
        });
        
        return newTableData;
      });

      setEditedRows({});
      console.log("Todas las filas actualizadas correctamente");
    } catch (error) {
      console.error("Error al actualizar varias filas:", error);
    }
  };

  const cancelChanges = () => {
    setEditedRows({});
    console.log("Cambios cancelados");
  };

  const hasChanges = (rowIndex) =>
    editedRows[rowIndex] &&
    Object.keys(editedRows[rowIndex]).length > 0;

  // ✅ VERSIÓN MEJORADA DE getCellValue
  const getCellValue = (rowIndex, columnName) => {
    // Primero verificar si hay cambios pendientes
    if (editedRows[rowIndex]?.[columnName] !== undefined) {
      return editedRows[rowIndex][columnName];
    }
    
    // Luego obtener el valor actual de la tabla
    return tableData[rowIndex]?.[columnName] ?? "";
  };

  // ✅ FUNCIÓN ADICIONAL PARA DEBUG
  const debugTableState = () => {
    console.log("=== DEBUG TABLE STATE ===");
    console.log("TableData:", tableData);
    console.log("EditedRows:", editedRows);
    console.log("========================");
  };

  return {
    editMode,
    setEditMode,
    tableData,
    editedRows,
    toggleEditMode,
    updateCell,
    acceptRowChanges,
    updateAllRows,
    setTableData,
    cancelChanges,
    hasChanges,
    getCellValue,
    isDateTimeColumn,
    debugTableState, // ✅ Para debugging
    pendingChangesCount: Object.keys(editedRows).length,
  };
};