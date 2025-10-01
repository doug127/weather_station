import ExcelJS from 'exceljs';
import {Sensor, ValuesTimescaled, Variable} from '../models/index.js'; 
import { getWeatherData } from '../services/meteostat.js';
import {sequelize} from '../server/db.js'; 
import { Op} from 'sequelize';

export const getValuesByTimestamp = async (req, res) => {
  try {
    let { timestamp } = req.query;

    if (!timestamp) {
      return res.status(400).json({ message: "El parámetro 'timestamp' es requerido" });
    }

    console.log("📥 Timestamp recibido:", timestamp);
    
    // El timestamp viene en formato: "YYYY-MM-DD HH:mm:ss±HH"
    // Ejemplo: "2025-09-01 02:00:00-04"
    
    // Parsear el timestamp manualmente
    let dateTimeStr, timezoneStr;
    
    // Buscar el offset de zona horaria (+ o -)
    const tzMatch = timestamp.match(/([+-]\d{2}(?::\d{2})?)$/);
    
    if (tzMatch) {
      timezoneStr = tzMatch[1]; // Ej: "-04" o "+05:30"
      dateTimeStr = timestamp.slice(0, -timezoneStr.length).trim(); // "YYYY-MM-DD HH:mm:ss"
    } else {
      dateTimeStr = timestamp.trim();
      timezoneStr = '+00'; // UTC por defecto
    }

    console.log("📅 Fecha/Hora:", dateTimeStr);
    console.log("🌍 Timezone:", timezoneStr);

    // Convertir a formato ISO que PostgreSQL entiende
    const isoTimestamp = `${dateTimeStr}${timezoneStr}`;
    
    console.log("🔄 ISO Timestamp para búsqueda:", isoTimestamp);

    // Buscar valores con ese timestamp exacto
    const values = await ValuesTimescaled.findAll({
      where: { 
        timestamp: isoTimestamp
      },
      include: [
        { model: Sensor, attributes: ["id", "code", "name"] },
      ],
    });

    console.log(`✅ Encontrados ${values.length} registros`);

    const formatted = values.map(v => ({
      sensor_id: v.Sensor.id,
      sensor_name: v.Sensor.name,
      code: v.Sensor.code,
      value: v.value,
      timestamp: v.timestamp
    }));

    res.json({ 
      requestedTimestamp: timestamp,
      parsedTimestamp: isoTimestamp,
      values: formatted,
      isExisting: values.length > 0
    });

  } catch (error) {
    console.error("❌ Error en getValuesByTimestamp:", error);
    res.status(500).json({ 
      message: "Error obteniendo datos por timestamp", 
      error: error.message 
    });
  }
};

export const insertMeteostatData = async (req, res) => {
    try {
        const { station, start, end } = req.query;
        
        if (!station || !start || !end) {
            return res.status(400).json({ message: 'Faltan parámetros de consulta obligatorios: estación, inicio, fin' });
        } 

        const response = await getWeatherData(station, start, end);
        const data = response.data;
        
        const inserted = [];
        const skipped = [];

        for (const record of data) {
          const date = record.date.split(' ')[0];

          for (const [code, value] of Object.entries(record)) {
            if (["date", "snow", "wpgt", "tsun"].includes(code)) continue;
            if (value === null || value === undefined) continue;
      
            const sensor = await Sensor.findOne({ where: { code } });
            if (!sensor) {
              skipped.push({ code, reason: 'Sensor no encontrado.' });
              continue
            };
            
            const timestamp = new Date(date);
            
            const existingValue = await ValuesTimescaled.findOne({
              where: { sensor_id: sensor.id, timestamp }
            });

            if (existingValue) {
              skipped.push({ code, timestamp, reason: 'El valor ya existe.' });
              continue;
            }

            const newValue = await ValuesTimescaled.create({
              sensor_id: sensor.id,
              timestamp,
              value: parseFloat(value)
            });

            inserted.push(newValue);
          }
        }

        res.status(200).json({ 
          message: 'Valores procesados correctamente.',
          inserted: inserted.length,
          skipped
        });
    } catch (error) {
        console.error('Error al procesar valores:', error);
        res.status(500).json({ message: error.message });
    }
}

export const getFilteredValuesData = async (req, res) => {
  try {
    const { sensors, sensor, variable, limit, minValue, maxValue, startDate, endDate, sort } = req;
    let lastUpdated = null;
    const whereClause = {};
    const sortOrder = sort?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    if (minValue !== undefined || maxValue !== undefined) {
      whereClause.value = {};
      if (minValue !== undefined) whereClause.value[Op.gte] = parseFloat(minValue);
      if (maxValue !== undefined) whereClause.value[Op.lte] = parseFloat(maxValue);
    }

    if (startDate && endDate) {
      whereClause.timestamp = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      whereClause.timestamp = { [Op.gte]: startDate };
    } else if (endDate) {
      whereClause.timestamp = { [Op.lte]: endDate };
    }

    let sensorWhere;

    if (sensors) {
      const sensorList = Array.isArray(sensors)
        ? sensors
        : sensors.split(',').map(s => s.trim());

      sensorWhere = {
        name: {
          [Op.or]: sensorList.map(name => ({ [Op.iLike]: `%${name}%` }))
        }
      };
    } else if (sensor) {
      sensorWhere = { name: { [Op.iLike]: `%${sensor}%` } };
    }

    let variableWhere;
    if(variable) {
      variableWhere = { name: { [Op.iLike]: `%${variable}%`} };
    }

    const values = await ValuesTimescaled.findAll({
      where: whereClause,
      include: [
        {
          model: Sensor,
          attributes: ['name', 'code'],
          where: sensorWhere,
          include: [
            {
              model: Variable,
              attributes: ['name', 'unit'],
              where: variableWhere
            }
          ]
        }
      ], 
      order: [['timestamp', sortOrder]],
      limit: limit ? parseInt(limit) : undefined
    });

    const grouped = {};

    for (const v of values) {
      const sensor = v.Sensor?.name;
      const code = v.Sensor?.code;
      const variable = v.Sensor?.Variable?.name;
      const unit = v.Sensor?.Variable?.unit;
      const key = `${sensor}|${variable}|${unit}`;

      if (!grouped[key]) {
        grouped[key] = {
          sensor,
          code,
          variable,
          unit,
          values: []
        };
      }

      grouped[key].values.push({
        value: v.value,
        timestamp: v.timestamp,
        updatedAt: v.updatedAt
      });

      if (!lastUpdated || new Date(v.updatedAt) > new Date(lastUpdated)) {
        lastUpdated = v.updatedAt;
      }
    }

    return {
      count: values.length,
      lastUpdated,
      data: Object.values(grouped)
    }

  } catch (error) {
      console.error('Error al obtener valores filtrados:', error);
      res.status(500).json({ 
        message: 'Error al obtener valores filtrados',
        error: error.message 
      });
  }
}

export const filteredValues = async (req, res) => {
  try {
    const result = await getFilteredValuesData(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error al obtener valores filtrados:', error);
    res.status(500).json({message: 'Error al obtener valores filtrados'});
  }
}

export const createValue = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { timestamp, values } = req.body;
    const createdValues = [];
    const skippedValues = [];
    let hasDuplicates = false;

    if (!timestamp || !Array.isArray(values)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Faltan campos obligatorios o el formato de datos no es válido.' });
    }

    for (const entry of values) {
      const { sensor_id, value } = entry;

      if (!sensor_id) {
        skippedValues.push({ ...entry, reason: 'Falta el sensor Id' });
        hasDuplicates = true;
        continue;
      }

      const ts = new Date(timestamp);
      if (isNaN(ts.getTime())) {
        skippedValues.push({ ...entry, reason: 'Marca de tiempo no válida.' });
        hasDuplicates = true;
        continue;
      }

      const now = new Date();
      if (ts > now) {
        skippedValues.push({ ...entry, reason: 'La marca de tiempo está en el futuro.' });
        hasDuplicates = true;
        continue;
      }

      const existingValue = await ValuesTimescaled.findOne({
        where: { timestamp: ts, value },
        transaction
      });

      if (existingValue) {
        skippedValues.push({ ...entry, reason: 'Valor duplicado para este momento y fecha' });
        hasDuplicates = true;
        continue;
      }

      // 🔹 Validación de min y max
      const sensor = await Sensor.findByPk(sensor_id, {
        include: { model: Variable, attributes: ['min', 'max'] }
      });

      if (!sensor || !sensor.Variable) {
        skippedValues.push({ ...entry, reason: 'Sensor o variable no encontrados' });
        hasDuplicates = true;
        continue;
      }

      const { min, max } = sensor.Variable;

      if (value < min || value > max) {
        skippedValues.push({ ...entry, reason: `Valor fuera de rango (${min} - ${max})` });
        hasDuplicates = true;
        continue;
      }
    }

    if (hasDuplicates && skippedValues.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'Algunos valores fueron rechazados.',
        skippedValues
      });
    }

    for (const entry of values) {
      const { sensor_id, value } = entry;

      const newValue = await ValuesTimescaled.create({
        value,
        timestamp: new Date(timestamp),
        sensor_id
      }, { transaction });

      createdValues.push(newValue);
    }

    await transaction.commit();

    return res.status(201).json({
      message: 'Todos los valores se insertaron correctamente.',
      inserted: createdValues.length,
      createdValues
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error:', error);
    res.status(500).json({
      message: 'Error Interno del Servidor',
      error: error.message
    });
  }
};


export const uploadValues = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "No se subió ningún archivo." });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0]; // primera hoja

    if (!worksheet) {
      await transaction.rollback();
      return res.status(400).json({ message: "El archivo está vacío." });
    }

    // 🔹 Cabeceras
    const headers = worksheet.getRow(1).values.slice(1); // quitamos el primer elemento vacío
    if (headers.length < 2 || headers[0] !== "datetime") {
      await transaction.rollback();
      return res.status(400).json({ message: "La primera columna debe ser 'datetime'." });
    }

    const sensorCodes = headers.slice(1);

    // 🔹 Verificar si todos los sensor codes existen
    const sensors = await Sensor.findAll({
      where: { code: sensorCodes },
      include: { model: Variable, attributes: ["min", "max"] },
      transaction,
    });

    if (sensors.length !== sensorCodes.length) {
      const dbCodes = sensors.map(s => s.code);
      const missing = sensorCodes.filter(c => !dbCodes.includes(c));
      await transaction.rollback();
      return res.status(400).json({
        message: `Los siguientes códigos de sensor no existen: ${missing.join(", ")}`,
      });
    }

    // 🔹 Crear un map para acceso rápido sensorCode → sensorId + variable info
    const sensorMap = {};
    sensors.forEach(s => {
      sensorMap[s.code] = {
        id: s.id,
        min: s.Variable.min,
        max: s.Variable.max,
      };
    });

    const valuesToInsert = [];
    const datetimesSet = new Set();

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // saltar cabecera

      const datetime = new Date(row.getCell(1).value);

      if (isNaN(datetime.getTime())) {
        throw new Error(`Fila ${rowNumber}: datetime inválido`);
      }

      // Validar duplicados dentro del archivo
      const key = datetime.toISOString();
      if (datetimesSet.has(key)) {
        throw new Error(`Fila ${rowNumber}: datetime repetido dentro del archivo (${key})`);
      }
      datetimesSet.add(key);

      // Validar duplicados en BD
      valuesToInsert.push({ datetime, row });
    });

    // 🔹 Verificar duplicados en BD antes de continuar
    const existing = await ValuesTimescaled.findAll({
      where: { timestamp: Array.from(datetimesSet) },
      transaction,
    });

    if (existing.length > 0) {
      const existingDates = existing.map(e => e.timestamp.toISOString());
      throw new Error(`Los siguientes datetime ya existen en la base de datos: ${existingDates.join(", ")}`);
    }

    // 🔹 Validar rangos y preparar inserciones
    const finalInsert = [];

    for (const { datetime, row } of valuesToInsert) {
      row.values.slice(2).forEach((val, idx) => {
        const code = sensorCodes[idx];
        const { id, min, max } = sensorMap[code];
        const value = parseFloat(val);

        if (isNaN(value)) {
          throw new Error(`Fila ${row.number}, sensor ${code}: valor no numérico`);
        }

        if (value < min || value > max) {
          throw new Error(
            `Fila ${row.number}, sensor ${code}: valor fuera de rango (${min}-${max}), recibido: ${value}`
          );
        }

        finalInsert.push({
          sensor_id: id,
          timestamp: datetime,
          value,
        });
      });
    }

    // 🔹 Insertar en DB
    await ValuesTimescaled.bulkCreate(finalInsert, { transaction });
    await transaction.commit();

    return res.status(201).json({
      message: "Valores cargados exitosamente.",
      inserted: finalInsert.length,
    });

  } catch (error) {
    await transaction.rollback();
    console.error("Error uploadValues:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const updateValue = async (req, res) => {
  try {
    const { timestamp, code, value } = req.body;

    // Validar datos
    if (!timestamp || !code || value === undefined) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Buscar sensor
    const sensor = await Sensor.findOne({ where: { code } });
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor no encontrado' });
    }

    // Actualizar valor
    const [updatedRows] = await ValuesTimescaled.update(
      { value },
      { where: { timestamp, sensor_id: sensor.id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    res.json({ message: 'Valor actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};