import {Sensor, Variable} from '../models/index.js';
import { generateDescription } from '../services/aiService.js';
import { Op } from 'sequelize';

export const getAll = async (req, res) => {
  try {
    const sensors = await Sensor.findAll({
      include: [
        { model: Variable, attributes: ['name', 'unit', 'min', 'max'] }
      ]
    });
    res.json({
        message: 'Sesnores mostrados correctamente.',
        total: sensors.length,
        data: sensors.map(sensor => ({
          id: sensor.id,
          serial: sensor.serial,
          code: sensor.code,
          name: sensor.name,
          description: sensor.description,
          variable: {
            name: sensor.Variable.name,
            unit: sensor.Variable.unit,
            min: sensor.Variable.min,
            max: sensor.Variable.max
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
            message: 'Sesnores mostrados correctamente.',
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
                { model: Variable, attributes: ['name', 'unit', 'min', 'max'] }
            ]
        });
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor no encontrado.' });
        }
        res.json({
            message: 'Sesnor mostrado correctamente.',
            data: {
                id: sensor.id,
                serial: sensor.serial,
                name: sensor.name,
                description: sensor.description,
                variable: {
                    name: sensor.Variable.name,
                    unit: sensor.Variable.unit,
                    min: sensor.Variable.min,
                    max: sensor.Variable.max
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const generateDescriptionSensor = async (req, res) => {
    try {
        const { name, variable } = req.body;

        if (!name || !variable) {
            return res.status(400).json({ message: "Faltan datos requeridos." });
        }

        const variableData = await Variable.findOne({ where: { name: variable } });
        if (!variableData) {
            return res.status(404).json({ message: "Variable no encontrada." });
        }

        const description = await generateDescription(name, variableData.name, variableData.unit);

<<<<<<< HEAD
        res.status(200).json({ description });
=======
        const isSuccess = description && description.split(" ").length > 30; 
        
        if (isSuccess) {
            return res.status(200).json({
                success: true,
                confirm: true, 
                description
            });
            } else {
            return res.status(200).json({
                success: false,
                confirm: false,
                description,
                suggestion: "Corrija el nombre del sensor o la variable antes de continuar."
            });
        }
>>>>>>> ms
    } catch (error) {
        res.status(500).json({ message: "Error generando descripción", error: error.message });
    }
};

export const create = async (req, res) => {   
    try {
        const { name, code, serial, variable, description } = req.body;

        const variableName = await Variable.findOne({ where: { name: variable } });
        if (!variableName) {
            return res.status(404).json({ message: `Variable no encontrada.` });
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
                message: 'Ya existe un sensor con el mismo nombre o código.',
                conflict: {
                    field: existingSensor.name === name ? 'name' : 'code',
                    value: existingSensor.name === name ? name : code
                }
            });
        }

        const sensor = await Sensor.create({
            name,
            code,
            serial,
            variableId: variableName.id,
            description
        });

        res.status(201).json({
            message: 'Sensor creado correctamente.',
            data: { name, code, serial, variable: variable.name, description }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error al crear el sensor.',
            error: error.message 
        });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
<<<<<<< HEAD
        const { name, code, description, variableId} = req.body;
=======
        const { nombre, codigo, descripcion, variable, serial } = req.body;
>>>>>>> ms

        const sensor = await Sensor.findByPk(id);
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor no encontrado.' });
        }

<<<<<<< HEAD
        if (variableId) {
            const variable = await Variable.findByPk(variableId);
            if (!variable) {
=======
        // Si se envía "variable" como nombre, buscamos el ID en la tabla Variable
        let variableId = sensor.variableId;
        if (variable) {
            const variableDb = await Variable.findOne({ where: { name: variable } });
            if (!variableDb) {
>>>>>>> ms
                return res.status(404).json({ message: 'Variable no encontrada.' });
            }
            variableId = variableDb.id;
        }

        sensor.name = nombre || sensor.name;
        sensor.code = codigo || sensor.code;
        sensor.serial = serial || sensor.serial;
<<<<<<< HEAD
        sensor.description = description || sensor.description;
        sensor.variableId = variableId || sensor.variableId;
=======
        sensor.description = descripcion || sensor.description;
        sensor.variableId = variableId;
>>>>>>> ms

        await sensor.save();

        res.json({
            message: 'Sensor actualizado correctamente.',
            data: sensor
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const destroy = async (req, res) => {
    const { id } = req.params;
    try {
        const sensor = await Sensor.findByPk(id);
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor no encontrado.' });
        }
        await sensor.destroy();
        res.json({ message: 'Sensor eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}