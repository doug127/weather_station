import {Sensor, ValuesTimescaled, Variable} from '../models/index.js'; 
import { getWeatherData } from '../services/meteostat.js';
import {sequelize} from '../server/db.js'; 
import { Op} from 'sequelize';

export const insertMeteostatData = async (req, res) => {
    try {
        const { station, start, end } = req.query;
        
        if (!station || !start || !end) {
            return res.status(400).json({ message: 'Missing required query parameters: station, start, end' });
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
              skipped.push({ code, reason: 'Sensor not found' });
              continue
            };
            
            const timestamp = new Date(date);
            
            const existingValue = await ValuesTimescaled.findOne({
              where: { sensor_id: sensor.id, timestamp }
            });

            if (existingValue) {
              skipped.push({ code, timestamp, reason: 'Value already exists' });
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
          message: 'Values processed successfully',
          inserted: inserted.length,
          skipped
        });
    } catch (error) {
        console.error('Error processing values:', error);
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

    const meditionWhere = {};
    if (startDate && endDate) {
      meditionWhere.date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      meditionWhere.date = { [Op.gte]: startDate };
    } else if (endDate) {
      meditionWhere.date = { [Op.lte]: endDate };
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
    console.error('Error fetching filtered values:', error);
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
    console.error('Error en filteredValues', error);
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
      return res.status(400).json({ message: 'Missing required fields or invalid data format' });
    }

    for (const entry of values) {
      const { sensor_id, value } = entry;

      if (!sensor_id) {
        skippedValues.push({ ...entry, reason: 'Missing sensor_id' });
        hasDuplicates = true;
        continue;
      }

      const ts = new Date(timestamp);
      if (isNaN(ts.getTime())) {
        skippedValues.push({ ...entry, reason: 'Invalid timestamp' });
        hasDuplicates = true;
        continue;
      }

      const now = new Date();
      if (ts > now) {
        skippedValues.push({ ...entry, reason: 'Timestamp is in the future' });
        hasDuplicates = true;
        continue;
      }

      const existingValue = await ValuesTimescaled.findOne({
        where: { timestamp: ts, value },
        transaction
      });

      if (existingValue) {
        skippedValues.push({ ...entry, reason: 'Duplicate value for this moment and date' });
        hasDuplicates = true;
        continue;
      }
    }

    if (hasDuplicates && skippedValues.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'Duplicate values found',
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
      message: 'All values inserted successfully',
      inserted: createdValues.length,
      createdValues
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};