import express from 'express';
import {
    insertMeteostatData,
    // paginated,
    createValue,
    filteredValues
} from '../controllers/valuesTimescale.controller.js';

const router = express.Router();

router.post('/meteostat', insertMeteostatData);
// router.get('/paginated', paginated);
router.get('/filtered', filteredValues);
router.post('/create', createValue);

export default router;
