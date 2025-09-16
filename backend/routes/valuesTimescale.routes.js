import express from 'express';
import multer from 'multer';
import {
    insertMeteostatData,
    // paginated,
    createValue,
    filteredValues,
    uploadValues
} from '../controllers/valuesTimescale.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/meteostat', insertMeteostatData);
router.get('/filtered', filteredValues);
router.post('/create', createValue);
router.post('/upload-file', upload.single('file'), uploadValues);

export default router;
