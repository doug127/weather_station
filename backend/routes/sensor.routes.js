import express from 'express';
import { 
    getAll,
    paginated, 
    getById, 
    create, 
    generateDescriptionSensor,
    update,
    destroy
} from '../controllers/sensor.controller.js';
import { roles } from '../utils/roles.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAll);
router.get('/paginated', paginated);
router.get('/:id', getById);
router.post('/create', verifyToken, authorizeRoles([roles.admin]), create);
router.post("/generate-description", verifyToken, authorizeRoles([roles.admin]), generateDescriptionSensor);
router.patch('/update/:id', verifyToken, authorizeRoles([roles.admin]), update);
router.delete('/destroy/:id', verifyToken, authorizeRoles([roles.admin]), destroy);

export default router;
