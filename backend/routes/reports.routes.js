import express from 'express'
import { generateExcelReport } from "../controllers/report.controller.js"

const router = express.Router()

router.get('/excel', generateExcelReport);

export default router;