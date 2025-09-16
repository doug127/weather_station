import ExcelJS from 'exceljs'
import { getFilteredValuesData } from './valuesTimescale.controller.js'

export const generateExcelReport = async (req, res) => {
  try {
    // 🚀 obtener valores filtrados (JOIN sensors + values_timescaled)
    const result = await getFilteredValuesData(req.query);
    const data = result.data;

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay datos para generar el reporte" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte Climático");

    // ✅ códigos de sensores únicos
    const sensorCodes = [...new Set(data.map((item) => item.code))];

    // ✅ Pivotear por fecha (YYYY-MM-DD) y sensor
    const dateMap = {};
    data.forEach((item) => {
      item.values.forEach((v) => {
        // convertir timestamp → fecha normalizada
        const date = new Date(v.timestamp).toISOString().split("T")[0];

        if (!dateMap[date]) {
          dateMap[date] = {};
        }
        dateMap[date][item.code] = v.value;
      });
    });

    // ✅ Definir columnas: Fecha + códigos sensores
    const columns = [
      { header: "Fecha", key: "date", width: 15 },
      ...sensorCodes.map((code) => ({ header: code, key: code, width: 15 })),
    ];
    worksheet.columns = columns;

    // ✅ Insertar filas
    Object.keys(dateMap)
      .sort((a, b) => new Date(a) - new Date(b)) // ordenar fechas ASC
      .forEach((date) => {
        const row = { date };
        sensorCodes.forEach((code) => {
          row[code] = dateMap[date][code] ?? "-"; // si no hay valor → "-"
        });
        worksheet.addRow(row);
      });

    // ✅ Estilo de encabezados
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };

    // ✅ Exportar
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=reporte.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generando el reporte Excel:", error);
    res.status(500).json({
      message: "Error al generar el reporte Excel",
      error: error.message,
    });
  }
};