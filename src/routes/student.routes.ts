import express from 'express';
import {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} from '../controllers/student.controller';
import { onlyAdmin } from '../types/global.types';
import { authenticate } from '../middlewares/auth.middleware';
import { uploader } from '../middlewares/uploader.middleware';


const router = express.Router();

const upload = uploader();

router.post('/', authenticate(onlyAdmin), upload.single('profile'), createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', authenticate(onlyAdmin), upload.single('profile'), updateStudent);
router.delete('/:id', authenticate(onlyAdmin), deleteStudent);

export default router;
