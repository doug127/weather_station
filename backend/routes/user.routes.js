import express from 'express';
import {
    getUsers,
    updateUserRoles
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getUsers);
router.put('/update-roles', updateUserRoles);

export default router;
