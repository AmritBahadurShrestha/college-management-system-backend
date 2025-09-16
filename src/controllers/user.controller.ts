import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/async-handler.utils';
import CustomError from '../middlewares/error-handler.middleware';


// Get All Users
export const getAllUsers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const users = await User.find().sort({ createdAt: -1});

        res.status(200).json({
            status: 'success',
            success: true,
            data: users,
            message: 'All users fetched successfully'
        });
    }
);

// Get User By ID
export const getUserById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            throw new CustomError('User not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: user,
            message: 'User fetched successfully'
        });
    }
);

// Update User
export const updateUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const payload = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: payload },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            throw new CustomError('User not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: updatedUser,
            message: 'User updated successfully'
        });
    }
);

// Delete User
export const deleteUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            throw new CustomError('User not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: deletedUser,
            message: 'User deleted successfully'
        });
    }
);
