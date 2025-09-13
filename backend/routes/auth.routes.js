import express from 'express';
import { 
    register, 
    login, 
    verifyEmail,
    passwordRecovery,
    resetPassword,
    logout,
    getCurrentUser,
    resendCode,
    updateUsername
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/password-recovery', passwordRecovery);
router.post('/reset-password', resetPassword);
router.get('/me', verifyToken, getCurrentUser);
router.post('/resend-code', resendCode);
router.patch('/update-username', verifyToken, updateUsername);

export default router;