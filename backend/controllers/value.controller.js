import {Sensor, Value, Moment, Medition, Variable} from '../models/index.js'; 
import { getWeatherData } from '../services/meteostat.js';
import {sequelize} from '../server/db.js'; 
import { Op } from 'sequelize';
import { update } from './sensor.controller.js';

export const insertMeteostatData = async (req, res) => {
    try {
        const { station, start, end } = req.query;
        const {frequency} = req.body;
        console.log(req.body);
        console.log(frequency);
        const response = await getWeatherData(station, start, end);
        const data = response.data;

        const moment = await Moment.findOne({ where: { hour: "18:00" } });
        if (!moment) {
            return res.status(404).json({ message: 'Moment not found' });
        }

        const momentId = moment.id;

        for (const record of data){
            const date = record.date.split(' ')[0];

            for (const [code, value] of Object.entries(record)){
                if (['date', 'snow', 'wpgt', 'tsun'].includes(code)) continue;
                if (value === null || value === undefined) continue;

                const sensor = await Sensor.findOne({ where: { code } });
                if(!sensor) continue;

                const medition = await Medition.create({
                    date,
                    frequency,
                    sensorId: sensor.id,
                });

                await Value.create({
                    value,
                    momentId, 
                    meditionId: medition.id,
                })
            }
        }
        res.status(200).json({ message: 'Values processed successfully' });
    } catch (error) {
        console.error('Error processing values:', error);
        res.status(500).json({ message: error.message });
    }
}

export const paginated = async (req, res) => {
    const limitPerSensor = parseInt(req.query.limit) || 5;

    try {
        const sensors = await Sensor.findAll();

        const results = [];

        for (const sensor of sensors) {
            const meditions = await Medition.findAll({
                where: { sensorId: sensor.id },
                include: [
                {
                    model: Value,
                    include: [{ model: Moment, attributes: ['hour'] }]
                }
                ],
                order: [['date', 'ASC']],
                limit: limitPerSensor 
            });

            const sensorValues = [];
            for (const medition of meditions) {
                for (const value of medition.Values) {
                if (sensorValues.length >= limitPerSensor) break;
                sensorValues.push({
                    value: value.value,
                    moment: value.Moment?.hour || 'N/A',
                });
                }
                if (sensorValues.length >= limitPerSensor) break;
            }

            results.push({
                sensor: sensor.name,
                code: sensor.code,
                values: sensorValues
            });
        }

        res.status(200).json({
        message: 'Values grouped by sensor retrieved successfully',
        data: results
        });
    } catch (error) {
        console.error('Error retrieving values:', error);
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

    const includeOptions = [
      {
        model: Medition,
        attributes: ['date'],
        where: Object.keys(meditionWhere).length ? meditionWhere : undefined,
        include: [
          {
            model: Sensor,
            attributes: ['name', 'code'],
            where: sensorWhere,
            required: sensorWhere || variable ? true : false,
            include: [
              {
                model: Variable,
                attributes: ['name', 'unit'],
                where: variable ? { name: { [Op.iLike]: `%${variable}%` } } : undefined,
                required: !!variable
              }
            ],
          }
        ],
        required: true
      },
      {
        model: Moment,
        attributes: ['hour']
      }
    ];
    
    const values = await Value.findAll({
      where: whereClause,
      include: includeOptions,
      order: [[{model: Medition}, 'date', sortOrder]],
      limit: limit ? parseInt(limit) : undefined
    });

    const grouped = {};

    for (const v of values) {
      const sensor = v.Medition.Sensor?.name;
      const code = v.Medition.Sensor?.code;
      const variable = v.Medition.Sensor?.Variable?.name;
      const unit = v.Medition.Sensor?.Variable?.unit;
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
        hour: v.Moment.hour,
        date: v.Medition.date,
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
    const { date, frequency, values } = req.body;
    const skippedValues = [];

    if (!date || frequency === undefined || !Array.isArray(values) || values.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Missing required fields or invalid data format' });
    }

    const today = new Date().toISOString().split('T')[0];
    const inputDate = new Date(date).toISOString().split('T')[0];

    if (inputDate > today) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Date cannot be in the future' });
    }

    const variableLimits = {
      9: { name: 'Evaporación', min: 0, max: 500 },            // mm
      8: { name: 'Presión atmosférica', min: 800, max: 1100 }, // hPa
      7: { name: 'Radiación solar', min: 0, max: 1400 },       // W/m²
      6: { name: 'Humedad relativa', min: 0, max: 100 },       // %
      5: { name: 'Velocidad del viento', min: 0, max: 200 },   // km/h
      4: { name: 'Dirección del viento', min: 0, max: 360 },   // °
      3: { name: 'Insolación', min: 0, max: 24 },              // horas
      2: { name: 'Precipitación', min: 0, max: 1000 },         // mm
      1: { name: 'Temperatura', min: -100, max: 70 }           // °C
    };

    for (const entry of values) {
      const { sensorId, momentId, value } = entry;

      if (!sensorId || !momentId || value === undefined) {
        skippedValues.push({ ...entry, reason: 'Missing sensorId, momentId or value' });
        continue;
      }

      const sensor = await Sensor.findByPk(sensorId);
      if (!sensor) {
        skippedValues.push({ ...entry, reason: 'Sensor not found' });
        continue;
      }

      const moment = await Moment.findByPk(momentId);
      if (!moment) {
        skippedValues.push({ ...entry, reason: 'Moment not found' });
        continue;
      }

      const variableId = sensor.variableId;
      const limits = variableLimits[variableId];

      if (!limits) {
        skippedValues.push({ ...entry, reason: 'No limits defined for this variable' });
        continue;
      }

      if (value < limits.min || value > limits.max) {
        skippedValues.push({
          ...entry,
          reason: `Value ${value} out of range for ${limits.name} (${limits.min}-${limits.max})`
        });
        continue;
      }

      // ✅ Verificar duplicados
      const existingValue = await Value.findOne({
        include: [{ model: Medition, where: { sensorId, date } }],
        where: { momentId },
        transaction
      });

      if (existingValue) {
        skippedValues.push({ ...entry, reason: 'Duplicate value for this moment and date' });
        continue;
      }
    }

    if (skippedValues.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'Validation errors, no values inserted',
        skippedValues
      });
    }

    const createdValues = [];
    for (const entry of values) {
      const { sensorId, momentId, value } = entry;

      const [medition] = await Medition.findOrCreate({
        where: { sensorId, date },
        defaults: { frequency, sensorId, date },
        transaction
      });

      const newValue = await Value.create({
        value,
        momentId,
        meditionId: medition.id
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

