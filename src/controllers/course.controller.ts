import Course from '../models/course.model';
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/async-handler.utils';
import CustomError from '../middlewares/error-handler.middleware';


// Create Course
export const createCourse = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;

        const course = await Course.create(payload);

        res.status(201).json({
            status: "success",
            success: true,
            data: course,
            message: "Course created successfully",
        });
    }
);

// Get All Courses
export const getAllCourses = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const courses = await Course.find().sort({ createdAt: -1});

        res.status(200).json({
            status: 'success',
            success: true,
            data: courses,
            message: 'All courses fetched successfully'
        });
    }
);

// Get Course By ID
export const getCourseById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            throw new CustomError('Course not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: course,
            message: 'Course fetched successfully'
        });
    }
);

// Update Course
export const updateCourse = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const payload = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $set: payload },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            throw new CustomError('Course not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: updatedCourse,
            message: 'Course updated successfully'
        });
    }
);

// Delete Course
export const deleteCourse = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            throw new CustomError('Course not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: deletedCourse,
            message: 'Course deleted successfully'
        });
    }
);
