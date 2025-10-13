import express from 'express';
import {
    createTeacher,
    getAllTeachers,
    getAllTeachersList,
    getTeacherById,
    updateTeacher,
    deleteTeacher
} from '../controllers/teacher.controller';
import { onlyAdmin } from '../types/global.types';
import { authenticate } from '../middlewares/auth.middleware';
import { uploader } from '../middlewares/uploader.middleware';

const router = express.Router();

const upload = uploader();

router.post('/', authenticate(onlyAdmin), upload.single('profile'), createTeacher);
router.get('/', getAllTeachers);
router.get('/all', getAllTeachersList);
router.get('/:id', getTeacherById);
router.put('/:id', authenticate(onlyAdmin), upload.single('profile'), updateTeacher);
router.delete('/:id', authenticate(onlyAdmin), deleteTeacher);

export default router;
