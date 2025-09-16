import { DataTypes } from "sequelize";
import { sequelize } from "../server/db.js";

export const Variable = sequelize.define("Variable", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    min: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    max: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
}, {
    tableName: 'variables'
})