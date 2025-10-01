import express from 'express';
import { 
    trainModel,
    predictWeather,
    trainAndPredictFromDb
} from "../services/sendToDjango.js";
import { verifyToken, authorizeRoles  } from '../middleware/auth.middleware.js';
import { roles } from '../utils/roles.js';

const router = express.Router();

router.post('/train-model', verifyToken, authorizeRoles([roles.admin]), trainModel);
router.post('/predict-model', verifyToken, authorizeRoles([roles.admin]), predictWeather);
router.post('/train-and-predict', verifyToken, authorizeRoles([roles.admin]), trainAndPredictFromDb);

export default router;