import express from 'express'
import {
    getAll,
    getById,
    create,
    update,
    destroy
} from '../controllers/variable.controller.js'
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';
import { roles } from '../utils/roles.js';

const router = express.Router();

router.get('/all', getAll);
router.get('/:id', getById);
router.post('/create', verifyToken, authorizeRoles([roles.admin]), create);
router.patch('/update/:id', verifyToken, authorizeRoles([roles.admin]), update);
router.delete('/destroy/:id', verifyToken, authorizeRoles([roles.admin]), destroy);

export default router;