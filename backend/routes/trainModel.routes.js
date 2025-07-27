import express from 'express';
import { trainModel } from "../services/sendToDjango.js";

const router = express.Router();

router.get('/train-model', trainModel);

export default router;