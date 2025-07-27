import express from 'express';
import { 
    trainModel,
    predictWeather
} from "../services/sendToDjango.js";

const router = express.Router();

router.get('/train-model', trainModel);
router.get('/predict-model', predictWeather);

export default router;