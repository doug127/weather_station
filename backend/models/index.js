import { Variable } from "./Variable.js";
import { Sensor } from "./Sensor.js";
import { ValuesTimescaled } from "./valuestimescale.js";
import { User } from "./User.js";
import { Role } from "./Role.js";

//? Variable 1-1 Sensor
Sensor.belongsTo(Variable, { foreignKey: 'variableId' });

// ? Sensor 1-M ValuesTimescaled
Sensor.hasMany(ValuesTimescaled, { foreignKey: 'sensor_id' });
ValuesTimescaled.belongsTo(Sensor, { foreignKey: 'sensor_id' });

// ? User 1-M Role
User.belongsTo(Role, { foreignKey: 'role_id' });

export {
  Variable,
  Sensor,
  ValuesTimescaled,
  User,
  Role  
};