import express from 'express'
import {
    getAll,
    getById,
    create,
    update,
    destory
} from '../controllers/variable.controller.js'

const router = express.Router();

router.get('/all', getAll);
router.get('/:id', getById);
router.post('/create', create);
router.patch('/update/:id', update);
router.delete('/destroy/:id', destory);

export default router;