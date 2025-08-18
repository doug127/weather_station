import ExcelJS from 'exceljs'
import { getFilteredValuesData } from './valuesTimescale.controller.js'

export const generateExcelReport = async (req, res) => {
    try {
        const result = await getFilteredValuesData(req.query);
        const data = result.data;

        if(!data || data.length === 0){
            return res.status(404).json({ message: "No hay datos para generar el reporte"})
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte Climático');

        const sensorCodes = data.map(item => item.code);

        const dateMap = {};
        data.forEach(item => {
            item.values.forEach(v => {
                const date = v.date;
                if (!dateMap[date]) {
                dateMap[date] = {};
                }
                dateMap[date][item.code] = v.value;
            });
        });

        const columns = [
            { header: 'Fecha', key: 'date', width: 15 },
            ...sensorCodes.map(code => ({ header: code, key: code, width: 15 }))
        ];
        worksheet.columns = columns;

        Object.keys(dateMap).forEach(date => {
            const row = { date };
            sensorCodes.forEach(code => {
                row[code] = dateMap[date][code] || 0; // Si no hay valor, ponemos 0
            });
            worksheet.addRow(row);
        });

        worksheet.getRow(1).font = { bold: true};
        worksheet.getRow(1).alignment = { horizontal: 'center' };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error generando el reporte Excel:', error);
        res.status(500).json({ message: 'Error al generar el reporte Excel', error: error.message });
    }
}