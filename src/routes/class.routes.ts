import express from 'express';
import {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass
} from '../controllers/class.controller';
import { onlyAdmin } from '../types/global.types';
import { authenticate } from '../middlewares/auth.middleware';


const router = express.Router();

router.post('/', authenticate(onlyAdmin), createClass);
router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.put('/:id', authenticate(onlyAdmin), updateClass);
router.delete('/:id', authenticate(onlyAdmin), deleteClass);

export default router;
