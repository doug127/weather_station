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

    const dateMap = {};
    data.forEach((item) => {
      item.values.forEach((v) => {
        // convertir timestamp → formato datetime YYYY-MM-DD HH:mm:ss
        const d = new Date(v.timestamp);
        const date =
          d.getFullYear() +
          "-" +
          String(d.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(d.getDate()).padStart(2, "0") +
          " " +
          String(d.getHours()).padStart(2, "0") +
          ":" +
          String(d.getMinutes()).padStart(2, "0") +
          ":" +
          String(d.getSeconds()).padStart(2, "0");

        if (!dateMap[date]) {
          dateMap[date] = {};
        }
        dateMap[date][item.code] = v.value;
      });
    });

    // ✅ Definir columnas: Fecha + códigos sensores
    const columns = [
      { header: "datetime", key: "datetime", width: 15 },
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