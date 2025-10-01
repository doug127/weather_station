import express from 'express';
import multer from 'multer';
import {
    getValuesByTimestamp,
    insertMeteostatData,
    // paginated,
    createValue,
    filteredValues,
    uploadValues,
    updateValue
} from '../controllers/valuesTimescale.controller.js';
import { roles } from '../utils/roles.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/by-timestamp', getValuesByTimestamp);
router.post('/meteostat', insertMeteostatData);
router.get('/filtered', filteredValues);
router.post('/create', verifyToken, authorizeRoles(roles.admin), createValue);
router.post('/upload-file', verifyToken, authorizeRoles(roles.admin), upload.single('file'), uploadValues);
router.patch('/update', updateValue);

export default router;
