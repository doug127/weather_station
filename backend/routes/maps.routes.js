import express from 'express';
import { getChirpsMap } from '../controllers/maps.controller.js';

const router = express.Router();

router.get('/', getChirpsMap);

export default router;