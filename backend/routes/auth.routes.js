import express from 'express';
import { 
    register, 
    login, 
    verifyEmail,
    passwordRecovery,
    resetPassword
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/password-recovery', passwordRecovery);
router.post('/reset-password', resetPassword);

export default router;