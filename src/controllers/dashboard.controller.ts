import Class from '../models/class.model';
import Course from '../models/course.model';
import Teacher from '../models/teacher.model';
import Student from '../models/student.model';
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/async-handler.utils';

export const getDashboard = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const students = await Student.countDocuments();
    const teachers = await Teacher.countDocuments();
    const courses = await Course.countDocuments();
    const classes = await Class.countDocuments();

    res.status(200).json({
      message: 'Dashboard data retrieved successfully',
      status: 'success',
      success: true,
      data: { students, teachers, courses, classes }
    });
  }
);
