import express from 'express'
import sensorRouter from './sensor.routes.js';
import valueRouter from './valuesTimescale.routes.js';
import variableRouter from './variable.routes.js'
import trainModelRouter from './trainModel.routes.js'
import reportRouter from './reports.routes.js'
import authRouter from './auth.routes.js';

const routes = express.Router();

routes.use('/sensor', sensorRouter);
routes.use('/variable', variableRouter);
routes.use('/auth', authRouter);
routes.use('/model', trainModelRouter);
routes.use('/report', reportRouter);
routes.use('/value', valueRouter);

export default routes;