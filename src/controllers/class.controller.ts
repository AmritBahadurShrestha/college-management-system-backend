import Class from '../models/class.model';
import { Request, Response, NextFunction } from 'express';
import { getPagination } from '../utils/pagination.utils';
import { asyncHandler } from '../utils/async-handler.utils';
import CustomError from '../middlewares/error-handler.middleware';


// Create Class
export const createClass = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;

        const classObj = await Class.create(payload);

        res.status(201).json({
            status: "success",
            success: true,
            data: classObj,
            message: "Class created successfully",
        });
    }
);

// Get All Classes
export const getAllClasses = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const { current_page, per_page } = req.query;

        const page = Number(current_page) || 1;
        const limit = Number(per_page) || 5;
        const skip = (page - 1) * limit;

        // Total number of classes
        const total = await Class.countDocuments();

        // Fetch classes with pagination
        const Classes = await Class.find().populate('students courses teacher').sort({ createdAt: -1}).limit(limit).skip(skip);

        res.status(200).json({
            status: 'success',
            success: true,
            data: Classes,
            pagination: getPagination(total, page, limit),
            message: 'All classes fetched successfully'
        });
    }
);

// Get Class By ID
export const getClassById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const classObj = await Class.findById(id).populate('students courses teacher');

        if (!classObj) {
            throw new CustomError('Class not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: classObj,
            message: 'Class fetched successfully'
        });
    }
);

// Update Class
export const updateClass = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const payload = req.body;

        const updatedClass = await Class.findByIdAndUpdate(
            id,
            { $set: payload },
            { new: true, runValidators: true }
        ).populate('students courses teacher');

        if (!updatedClass) {
            throw new CustomError('Class not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: updatedClass,
            message: 'Class updated successfully'
        });
    }
);

// Delete Class
export const deleteClass = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deletedClass = await Class.findByIdAndDelete(id);

        if (!deletedClass) {
            throw new CustomError('Class not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: deletedClass,
            message: 'Class deleted successfully'
        });
    }
);
