import { DataTypes } from 'sequelize';
import { sequelize } from '../server/db.js';
import { Sensor } from './Sensor.js';

export const Dashboard = sequelize.define('Dashboard', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sensor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Sensor,
      key: 'id'
    }
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
    is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  chart_mode: {
    type: DataTypes.ENUM('multi', 'single', 'select'),
    allowNull: false,
    defaultValue: 'single'
  }
}, {
  tableName: 'dashboard'
});