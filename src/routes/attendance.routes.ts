import express from 'express';
import {
    createAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    getAttendanceByStudentId,
    getAttendanceByCourseId,
    getAttendanceByClassId
} from '../controllers/attendance.controller';
import { allAdminsTeachers } from '../types/global.types';
import { authenticate } from '../middlewares/auth.middleware';


const router = express.Router();

router.post('/', authenticate(allAdminsTeachers), createAttendance);
router.get('/', getAllAttendance);
router.get('/:id', getAttendanceById);
router.put('/:id', authenticate(allAdminsTeachers), updateAttendance);
router.delete('/:id', authenticate(allAdminsTeachers), deleteAttendance);
router.get('/student/:studentId', getAttendanceByStudentId);
router.get('/course/:courseId', getAttendanceByCourseId);
router.get('/class/:classId', getAttendanceByClassId);

export default router;
