import express from 'express'
import sensorRouter from './sensor.routes.js';
import valueRouter from './value.routes.js';
import variableRouter from './variable.routes.js'
import trainModelRouter from './trainModel.routes.js'

const routes = express.Router();

routes.use('/sensor', sensorRouter);
routes.use('/value', valueRouter);
routes.use('/variable', variableRouter);
routes.use('/model', trainModelRouter);

export default routes;