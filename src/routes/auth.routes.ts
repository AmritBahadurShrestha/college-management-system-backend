import express from 'express';
import {
    register,
    login,
    getCurrentUser,
    changePassword,
    logout
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.get('/me', authenticate(), getCurrentUser);
router.post('/change-password', changePassword);
router.post('/logout', logout);

export default router;
