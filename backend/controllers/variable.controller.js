import { where, Op } from "sequelize";
import { Variable } from "../models/index.js"; 
import { sequelize } from "../server/db.js";

export const getAll = async (req, res) => {
    try{
        const variables = await Variable.findAll();
        res.status(200).json({variables});
    } catch (error) {
        console.error("Error al obtener variables: ", error);
        res.status(500).json({message: "Error Interno del Servidor"})
    }
}

export const getById = async (req, res) => {
    try {
        const variable = await Variable.findByPk(req.params.id);
        if(!variable){
            res.status(404).json({message: "Variable no encontrada."});
        }
        res.status(200).json({variable});
    } catch (error){
        console.error("Error al obtener variables: ", error);
        res.status(500).json({message: "Error Interno del Servidor"});
    }
}

export const create = async (req, res) => {
    try {
        const {name, unit} = req.body;

        if (!name || !unit){
            return res.status(400).json({
                message: "Nombre y unidad de medida es requerido."
            });
        }

        const existingVariable = await Variable.findOne({
            where: {
                name: {
                    [Op.iLike]: name
                }
            }
        });

        if (existingVariable) {
            return res.status(409).json({ 
                message: "La variable ya existe.",
                existingVariable
            })    
        } 

        const newVariable = await Variable.create({
            name: name.trim(),
            unit: unit.trim()
        })

        res.status(201).json({
            message: "Variable creada correctamente.",
            data: newVariable
        });
         
    } catch (error){
        console.error({"Error al crear variable": error});
        res.status(500).json({message: "Error Interno del Servidor"});
    }
}

export const update = async (req, res) => {
    try {
        const variable = await Variable.findByPk(req.params.id);

        if (!variable) {
            return res.status(404).json({ message: "Variable no encontrada." });
        }

        const { name, unit } = req.body;

        if (!name && !unit) {
            return res.status(400).json({
                message: "Include at least one piece of information"
            });
        }

        if(name) {
            const existingVariable = await Variable.findOne({
                    where: {
                        name: sequelize.where(
                            sequelize.fn('LOWER', sequelize.col('name')),
                            'LIKE', `%${name.toLowerCase()}%`
                        ),
                        id: { [Op.ne]: req.params.id }
                    }
                });

            if(existingVariable){
                return res.status(409).json({
                    message: "El nombre de variable ya existe.",
                    existingVariable
                })
            }

            variable.name = name
        }

        if (unit) variable.unit = unit;

        await variable.save();

        res.status(200).json({
            message: "Variable actualizada correctamente.",
            variable
        });

    } catch (error) {
        console.error("Error actualizado variable:", error);
        res.status(500).json({ message: "Error Interno del Servidor" });
    }
};

export const destroy = async (req, res) => {
    try {
        const variable = await Variable.findByPk(req.params.id);

        if(!variable){
            return res.status(404).json({ message: "Variable no encontrada."});
        }

        await variable.destroy();

        res.status(200).json({message: "Variable eliminada correctamente."});

    } catch (error) {
        console.error("Error al eliminar variable");
        res.status(500).json({ message: "Error Interno del Servidor"});
    }
}