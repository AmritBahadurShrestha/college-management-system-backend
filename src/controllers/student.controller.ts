import Student from '../models/student.model';
import { getPagination } from '../utils/pagination.utils';
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/async-handler.utils';
import CustomError from '../middlewares/error-handler.middleware';
import { uploadFile, deleteFiles } from '../utils/cloudinary-service.utils';
// import { sendEmail } from '../utils/nodemailer.utils';
// import { generate_student_account_email } from '../utils/email.utils';


// Register Student Profile
const folder_name = '/students';

// Create Student
export const createStudent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;

        // Handle profile upload
        const profile = req.file as Express.Multer.File;

        if (!profile) {
            throw new CustomError("Profile is required", 400);
        }

        // Creating Student Instance
        const student = new Student(payload);

        const { path, public_id } = await uploadFile(
            profile.path,
            folder_name
        );

        // Update new profile
        student.profile = {
            path,
            public_id,
        };

        await student.save();

        //! Generate random password
        // const password = Math.random().toString(36).slice(-8);

        // await sendEmail({
        //     html: generate_student_account_email(student, password),
        //     subject: 'Your Student Account Details',
        //     to: student.email,
        // });

        res.status(201).json({
            status: "success",
            success: true,
            data: student,
            message: "Student created successfully",
        });
    }
);

// Get All Students
export const getAllStudents = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const { current_page, per_page } = req.query;

        const page = Number(current_page) || 1;
        const limit = Number(per_page) || 2;
        const skip = (page - 1) * limit;

        // Total number of students
        const total = await Student.countDocuments();

        // Fetch students with pagination
        const students = await Student.find().populate('courses').sort({ createdAt: -1}).limit(limit).skip(skip);

        res.status(200).json({
            status: 'success',
            success: true,
            data: students,
            pagination: getPagination(total, page, limit),
            message: 'All students fetched successfully'
        });
    }
);

// Get Student By ID
export const getStudentById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const student = await Student.findById(id).populate('courses');

        if (!student) {
            throw new CustomError('Student not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: student,
            message: 'Student fetched successfully'
        });
    }
);

// Update Student
export const updateStudent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const payload = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { $set: payload },
            { new: true, runValidators: true }
        ).populate('courses');

        if (!updatedStudent) {
            throw new CustomError('Student not found', 404);
        }

        // Handle profile upload
        const profile = req.file as Express.Multer.File;

        if (profile) {
            const { path, public_id } = await uploadFile(
                profile.path,
                folder_name
            );

            // Delete old profile
            if (updatedStudent.profile && updatedStudent.profile.public_id) {
                await deleteFiles([updatedStudent.profile.public_id]);
            }
            // Update new profile
            updatedStudent.profile = {
                path,
                public_id,
            };
        }

        await updatedStudent.save();

        res.status(200).json({
            status: 'success',
            success: true,
            data: updatedStudent,
            message: 'Student updated successfully'
        });
    }
);

// Delete Student
export const deleteStudent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            throw new CustomError('Student not found', 404);
        }

        // Delete profile
        if (deletedStudent.profile) {
            await deleteFiles([deletedStudent.profile?.public_id]);
        }

        await deletedStudent.deleteOne();

        res.status(200).json({
            status: 'success',
            success: true,
            data: deletedStudent,
            message: 'Student deleted successfully'
        });
    }
);
