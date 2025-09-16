import express from 'express';
import {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass
} from '../controllers/class.controller';
import { allAdminsTeachers } from '../types/global.types';
import { authenticate } from '../middlewares/auth.middleware';


const router = express.Router();

router.post('/', authenticate(allAdminsTeachers), createClass);
router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.put('/:id', authenticate(allAdminsTeachers), updateClass);
router.delete('/:id', authenticate(allAdminsTeachers), deleteClass);

export default router;
