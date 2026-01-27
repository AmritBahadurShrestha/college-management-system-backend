import express from 'express';
import {
    register,
    login,
    getCurrentUser,
    changePassword,
    logout
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.get('/me', getCurrentUser);
router.post('/change-password', changePassword);
router.post('/logout', logout);

export default router;
