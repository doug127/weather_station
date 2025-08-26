import {Sensor, Variable} from '../models/index.js';
import { generateDescription } from '../services/aiService.js';
import { Op } from 'sequelize';

export const getAll = async (req, res) => {
  try {
    const sensors = await Sensor.findAll({
      include: [
        { model: Variable, attributes: ['name', 'unit'] }
      ]
    });
    res.json({
        message: 'Sensors retrieved successfully',
        total: sensors.length,
        data: sensors.map(sensor => ({
          id: sensor.id,
          serial: sensor.serial,
          name: sensor.name,
          variable: {
            name: sensor.Variable.name,
            unit: sensor.Variable.unit
          }
        }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}   

export const paginated = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Sensor.findAndCountAll({
            include: [
                { model: Variable, attributes: ['name', 'unit'] }
            ],
            limit,
            offset,
            order: [['id', 'ASC']]
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            message: 'Sensors retrieved successfully',
            total: count,
            page,
            totalPages,
            data: rows.map(sensor => ({
                id: sensor.id,
                serial: sensor.serial,
                name: sensor.name,
                description: sensor.description,
                variable: {
                    name: sensor.Variable.name,
                    unit: sensor.Variable.unit
                }
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getById = async (req, res) => {
    
    const { id } = req.params;
    
    try {
        const sensor = await Sensor.findByPk(id, {
            include: [
                { model: Variable, attributes: ['name', 'unit'] }
            ]
        });
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }
        res.json({
            message: 'Sensor retrieved successfully',
            data: {
                id: sensor.id,
                serial: sensor.serial,
                name: sensor.name,
                description: sensor.description,
                variable: {
                    name: sensor.Variable.name,
                    unit: sensor.Variable.unit
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const create = async (req, res) => {   
    try {
        const {name, code, serial, variableId} = req.body;
        
        const variable = await Variable.findByPk(variableId);
        
        if (!variable) {
            return res.status(404).json({ message: `Variable not found` });
        }

        const existingSensor = await Sensor.findOne({
            where: {
                [Op.or]: [
                    { name },
                    { code }
                ]
            }
        });

        if (existingSensor) {
            return res.status(409).json({
                message: 'Sensor with the same name or code already exists',
                conflict: {
                    field: existingSensor.name === name ? 'name' : 'code',
                    value: existingSensor.name === name ? name : code
                }
            });
        }

        const variable_ai = await Variable.findByPk(variableId);
        const variable_name = variable_ai.name;
        const variable_unit = variable_ai.unit;
        const description = await generateDescription(name, variable_name, variable_unit);

        const sensor = await Sensor.create({
            name,
            code,
            serial,
            variableId,
            description
        });
        res.status(201).json({
            message: 'Sensor created successfully',
            data: sensor
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating sensor1',
            error: error.message 
        });
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, description, variableId} = req.body;

        const sensor = await Sensor.findByPk(id);
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }

        if (variableId) {
            const variable = await Variable.findByPk(variableId);
            if (!variable) {
                return res.status(404).json({ message: 'Variable not found' });
            }
        }

        sensor.name = name || sensor.name;
        sensor.code = code || sensor.code;
        sensor.serial = serial || sensor.serial;
        sensor.description = description || sensor.description;
        sensor.variableId = variableId || sensor.variableId;

        await sensor.save();

        res.json({
            message: 'Sensor updated successfully',
            data: sensor
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const destroy = async (req, res) => {
    const { id } = req.params;
    try {
        const sensor = await Sensor.findByPk(id);
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }
        await sensor.destroy();
        res.json({ message: 'Sensor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}