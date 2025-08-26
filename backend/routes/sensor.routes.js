import express from 'express';
import { 
    getAll,
    paginated, 
    getById, 
    create, 
    update,
    destroy
} from '../controllers/sensor.controller.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();
const adminRole = 1;

router.get('/', getAll);
router.get('/paginated', paginated);
router.get('/:id', getById);
router.post('/create', create);
router.patch('/update/:id', verifyToken, authorizeRoles([adminRole]), update);
router.delete('/destroy/:id', verifyToken, authorizeRoles([adminRole]), destroy);

export default router;
