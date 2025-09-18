import express from 'express';
import { onlyAdmin } from '../types/global.types';
import { authenticate } from '../middlewares/auth.middleware';
import { getDashboard } from '../controllers/dashboard.controller';

const router = express.Router();

router.get('/', authenticate(onlyAdmin), getDashboard);

export default router;
