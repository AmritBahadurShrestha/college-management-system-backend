import express from 'express';
import {
    register,
    login,
    getCurrentUser,
    changePassword,
    logout
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { allAST, onlyAdmin } from '../types/global.types';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.get('/me', authenticate(allAST), getCurrentUser);
router.post('/change-password', changePassword);
router.post('/logout', logout);

export default router;
