import express from 'express';
import { 
    trainModel,
    predictWeather,
    trainAndPredictFromDb
} from "../services/sendToDjango.js";

const router = express.Router();

router.post('/train-model', trainModel);
router.post('/predict-model', predictWeather);
router.post('/train-and-predict', trainAndPredictFromDb);

export default router;