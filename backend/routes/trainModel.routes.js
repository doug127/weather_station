import express from 'express';
import { 
    trainModel,
    predictWeather
} from "../services/sendToDjango.js";

const router = express.Router();

router.post('/train-model', trainModel);
router.post('/predict-model', predictWeather);

export default router;