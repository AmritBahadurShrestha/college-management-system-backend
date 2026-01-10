import Course from '../models/course.model';
import { Request, Response, NextFunction } from 'express';
import { getPagination } from '../utils/pagination.utils';
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

        const { current_page, per_page, query } = req.query;

        const page = Number(current_page) || 1;
        const limit = Number(per_page) || 5;
        const skip = (page - 1) * limit;

        const searchQuery = typeof query === 'string'? query:''

        let filter:any = {}

        if (searchQuery) {
            filter.$or = [
                {
                    name: { $regex: searchQuery, $options: 'i' }
                }
            ]
        }

        // Total number of courses
        const total = await Course.countDocuments(filter);

        // Fetch courses with pagination
        const courses = await Course.find(filter).sort({ createdAt: -1 }).limit(limit).skip(skip);

        res.status(200).json({
            status: 'success',
            success: true,
            data: courses,
            pagination: getPagination(total, page, limit),
            message: 'All courses fetched successfully'
        });
    }
);

// Get All Courses List Used In All Forms
export const getAllCoursesList = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const courses = await Course.find().sort({ name: 1 });

        res.status(200).json({
            status: 'success',
            success: true,
            data: courses,
            message: 'All courses list fetched successfully'
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
