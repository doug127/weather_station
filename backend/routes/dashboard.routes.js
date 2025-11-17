import express from 'express';
import {
    getActiveDashboard,
    updateDashboardItem
} from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/active', getActiveDashboard);
router.patch('/update/:id', updateDashboardItem);

export default router;