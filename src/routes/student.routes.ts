import express from 'express';
import {
    createStudent,
    getAllStudents,
    getAllStudentsList,
    getStudentById,
    updateStudent,
    deleteStudent, getStudentsByClass
} from '../controllers/student.controller';
import { onlyAdmin } from '../types/global.types';
import { authenticate } from '../middlewares/auth.middleware';
import { uploader } from '../middlewares/uploader.middleware';

const router = express.Router();

const upload = uploader();

router.post('/', authenticate(onlyAdmin), upload.single('profile'), createStudent);
router.get('/', getAllStudents);
router.get('/all', getAllStudentsList);
router.get('/:id', getStudentById);
router.put('/:id', authenticate(onlyAdmin), upload.single('profile'), updateStudent);
router.delete('/:id', authenticate(onlyAdmin), deleteStudent);

router.get('/class/:classId', getStudentsByClass);


export default router;
