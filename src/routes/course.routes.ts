import express from 'express';
import {
    createCourse,
    getAllCourses,
    getAllCoursesList,
    getCourseById,
    updateCourse,
    deleteCourse
} from '../controllers/course.controller';
import { onlyAdmin } from '../types/global.types';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authenticate(onlyAdmin), createCourse);
router.get('/', getAllCourses);
router.get('/all', getAllCoursesList);
router.get('/:id', getCourseById);
router.put('/:id', authenticate(onlyAdmin), updateCourse);
router.delete('/:id', authenticate(onlyAdmin), deleteCourse);

export default router;
