import { NextFunction, Request, Response } from 'express';
import CustomError from '../middlewares/error-handler.middleware';
import Teacher from '../models/teacher.model';
import User from '../models/user.model';
import { asyncHandler } from '../utils/async-handler.utils';
import { hashPassword } from '../utils/bcrypt.utils';
import { deleteFiles, uploadFile } from '../utils/cloudinary-service.utils';
import { sendEmail } from '../utils/nodemailer.utils';
import { getPagination } from '../utils/pagination.utils';
import { generatePassword } from '../utils/PasswordGenerator.utils';

// Register Teacher Profile
const folder_name = '/teachers';

// Create Teacher
export const createTeacher = asyncHandler(

  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get details 
    const { fullName, email, phone, gender, department, courses, role = 'TEACHER' } = req.body;
    
    // Handle profile upload
    const profile = req.file as Express.Multer.File;

    if (!profile) {
        throw new CustomError("Profile is required", 400);
    }

    // Upload file first
    const { path, public_id } = await uploadFile(
        profile.path,
        folder_name
    );

    // Generate random password
    const password = generatePassword();
    const hashedPassword = await hashPassword(password);

    // Create Teacher Instance with ALL required fields
    const teacher = await Teacher.create({
        fullName,
        email,
        phone,
        gender,
        department,
        courses,
        role,
        profile: {
            path,
            public_id,
        }
    });

    const user: any = await User.create({
            fullName,
            email,
            password:hashedPassword,
            phone,
            role,
            isnewAdded: true
        });

    console.log("Teacher created successfully");
    console.log("password => ", password, " email => ", teacher.email);

    // Send email with credentials
    await sendEmail({
        html: `
            <div>Your login email: ${teacher.email}</div>
            <div>Your login password: ${password}</div>
            <p>Please change your password after login</p>
        `,
        subject: 'Login Password',
        to: teacher.email,
    });

    res.status(201).json({
        status: "success",
        success: true,
        data: teacher,
        message: "Teacher created successfully",
    });
}


    
);

// Get All Teachers
export const getAllTeachers = asyncHandler(
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
                    fullName: { $regex: searchQuery, $options: 'i' }
                }
            ]
        }

        // Total number of teachers
        const total = await Teacher.countDocuments(filter);

        // Fetch teachers with pagination
        const teachers = await Teacher.find(filter).populate('courses').sort({ createdAt: -1 }).limit(limit).skip(skip);

        res.status(200).json({
            status: 'success',
            success: true,
            data: teachers,
            pagination: getPagination(total, page, limit),
            message: 'All teachers fetched successfully'
        });
    }
);

// Get All Teachers List Used In All Forms
export const getAllTeachersList = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const teachers = await Teacher.find().sort({ fullName: 1 });

        res.status(200).json({
            status: 'success',
            success: true,
            data: teachers,
            message: 'All teachers list fetched successfully'
        });
    }
);

// Get Teacher By ID
export const getTeacherById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.params;

        const teacher = await Teacher.findOne({email: email}).populate('courses');

        if (!teacher) {
            throw new CustomError('Teacher not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: teacher,
            message: 'Teacher fetched successfully'
        });
    }
);

// Update Teacher
export const updateTeacher = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const payload = req.body;

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id,
            { $set: payload },
            { new: true, runValidators: true }
        ).populate('courses');

        if (!updatedTeacher) {
            throw new CustomError('Teacher not found', 404);
        }
        
        // Handle profile upload
        const profile = req.file as Express.Multer.File;

        if (profile) {
            const { path, public_id } = await uploadFile(
                profile.path,
                folder_name
            );

            // Delete old profile
            if (updatedTeacher.profile && updatedTeacher.profile.public_id) {
                await deleteFiles([updatedTeacher.profile.public_id]);
            }
            // Update new profile
            updatedTeacher.profile = {
                path,
                public_id,
            };
        }

        await updatedTeacher.save();

        res.status(200).json({
            status: 'success',
            success: true,
            data: updatedTeacher,
            message: 'Teacher updated successfully'
        });
    }
);

// Delete Teacher
export const deleteTeacher = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deletedTeacher = await Teacher.findByIdAndDelete(id);

        if (!deletedTeacher) {
            throw new CustomError('Teacher not found', 404);
        }

        // Delete profile
        if (deletedTeacher.profile) {
            await deleteFiles([deletedTeacher.profile?.public_id]);
        }

        await deletedTeacher.deleteOne();

        res.status(200).json({
            status: 'success',
            success: true,
            data: deletedTeacher,
            message: 'Teacher deleted successfully'
        });
    }
);
