import { DataTypes } from "sequelize";
import { sequelize } from "../server/db.js";
import { Sensor } from "./Sensor.js";

export const ValuesTimescaled = sequelize.define("ValuesTimescaled", {
  sensor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Sensor, 
      key: 'id'
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: true,
  }
}, {
  tableName: "values_timescaled",
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  freezeTableName: true,
  indexes: [
    {
      unique: true,
      fields: ['sensor_id', 'timestamp']
    }
  ]
});