import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/async-handler.utils';
import CustomError from '../middlewares/error-handler.middleware';
import { hashPassword, compareHash } from '../utils/bcrypt.utils';
import { IJWTPayload } from '../types/global.types';
import { generateToken } from '../utils/jwt.utils';

// Register User
export const register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { fullName, email, password, phone, role } = req.body;

        if (!password) {
            throw new CustomError('Password is required', 400);
        }

        // Create user
        const user: any = await User.create({
            fullName,
            email,
            password,
            phone,
            role,
        });

        const hashedPassword = await hashPassword(password);

        user.password = hashedPassword;

        await user.save();

        const { password: pass, ...newUser } = user._doc;

        res.status(201).json({
            status: 'success',
            success: true,
            data: newUser,
            message: 'User registered successfully'
        });
    }
);

// Login User
export const login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        if (!email) {
            throw new CustomError('Email is required', 400);
        }

        if (!password) {
            throw new CustomError('Password is required', 400);
        }

        // Check if user exists
        const user: any = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new CustomError('Invalid credentials', 400);
        }

        const isPassMatch = await compareHash(password, user.password ?? '');

        if (!isPassMatch) {
            throw new CustomError('Invalid credentials', 400);
        }

        // Generate auth token
        const payload: IJWTPayload = {
            _id: user._id,
            email: user.email,
            role: user.role,
            fullName: user.fullName
        };

        // Generate JWT token
        const access_token = generateToken(payload);

        const { password: pass, ...loggedInUser } = user._doc;

        res.cookie(
                'access_token', access_token, {
                secure: process.env.NODE_ENV === 'development' ? false : true,
                httpOnly: true,
                maxAge: Number(process.env.COOKIE_EXPIRY) * 24 * 60 * 60 * 1000,
                sameSite: 'none'
            }
        ).status(200).json({
            status: 'success',
            success: true,
            data: {
                data: loggedInUser,
                access_token
            },
            message: 'Login successful'
        });
    }
);

// Change Password
export const changePassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, old_password, new_password } = req.body;

        if (!email) {
            throw new CustomError('Email is required', 400);
        }

        if (!old_password) {
            throw new CustomError('Old password is required', 400);
        }

        if (!new_password) {
            throw new CustomError('New password is required', 400);
        }

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new CustomError('User not found', 400);
        }

        const isPassMatched = compareHash(old_password, user.password);

        if (!isPassMatched) {
            throw new CustomError('Old password does not match.', 400);
        }

        user.password = await hashPassword(new_password);

        await user.save();

        res.status(200).json({
            status: 'success',
            success: true,
            data: user,
            message: 'Password updated successfully'
        });
    }
);

// Get Current Logged-in User
export const getCurrentUser = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        if (!userId) {
            throw new CustomError('Unauthorized', 400);
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new CustomError('User not found', 400);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: user,
            message: 'Current user fetched successfully',
        });
    }
);

// Logout User
export const logout = asyncHandler(
    async (req: Request, res: Response) => {

        res.clearCookie(
            'access_token', {
                secure: process.env.NODE_ENV === 'development' ? false : true,
                httpOnly: true,
                sameSite: 'none'
            }
        ).status(200).json({
            status: 'success',
            success: true,
            data: null,
            message: 'Logout successful',
        });
    }
);
