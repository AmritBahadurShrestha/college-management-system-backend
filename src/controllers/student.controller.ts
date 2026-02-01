import { NextFunction, Request, Response } from 'express';
import CustomError from '../middlewares/error-handler.middleware';
import Attendance from '../models/attendance.model';
import Student from '../models/student.model';
import User from '../models/user.model';
import { asyncHandler } from '../utils/async-handler.utils';
import { hashPassword } from '../utils/bcrypt.utils';
import { deleteFiles, uploadFile } from '../utils/cloudinary-service.utils';
import { sendEmail } from '../utils/nodemailer.utils';
import { getPagination } from '../utils/pagination.utils';
import { generatePassword } from '../utils/PasswordGenerator.utils';

// Register Student Profile
const folder_name = '/students';

// Create Student
export const createStudent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        
        // 1. get details 
            const { fullName, email, phone, address, dob, gender, rollNumber, registrationNumber, program, semester, courses,classes, role = 'STUDENT' } = req.body;
        
        
        console.log("fullName:", fullName, "email:", email, "phone:", phone, "address:", address, "dob:", dob, "gender:", gender, "rollNumber:", rollNumber, "registrationNumber:", registrationNumber, "program:", program, "semester:", semester, "courses:", courses, "classes:", classes, "role:", role);


        // Handle profile upload
        const profile = req.file as Express.Multer.File;

        if (!profile) {
            throw new CustomError("Profile is required", 400);
        }

        // Creating Student Instance
        const student = new Student({ fullName, email, phone, address, dob, gender, rollNumber, registrationNumber, program, semester,classes, courses, role  });

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
        const password =  generatePassword();

        // 2. usermodel into username, password , isnewAdded
        const user: any = await User.create({
            fullName,
            email,
            password,
            phone,
            role,
            isnewAdded: true
        });

        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        await user.save();

        console.log("password => ", password , " email => ", student.email        )
        await sendEmail({
            html:`
            <div>Your login email: ${student.email}</div>
            <div>Your login password: ${password}</div>
                <p>please! change your password after login</p>
                `,
            subject: 'Login Password',
            to: student.email,
        });

        

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

            const { current_page, per_page, query } = req.query;
            // const {query} = req.body

            const page = Number(current_page) || 1;
            const limit = Number(per_page) || 5;
            const skip = (page - 1) * limit;

            const searchQuery = typeof query === 'string'? query:''

            let filter:any={}

            if (searchQuery) {
                filter.$or = [
                    {
                        fullName: { $regex: searchQuery, $options: 'i' }
                    }
                ]
            }

            // Total number of students
            const total = await Student.countDocuments(filter);

            // Fetch students with pagination
            const students = await Student.find(filter).populate('courses').sort({ createdAt: -1 }).limit(limit).skip(skip);


            console.log(students)
            res.status(200).json({
                status: 'success',
                success: true,
                data: students,
                pagination: getPagination(total, page, limit),
                message: 'All students fetched successfully'
            });
        }
    );

// Get All Students List Used In All Forms
export const getAllStudentsList = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const students = await Student.find().sort({ fullName: 1 });

        res.status(200).json({
            status: 'success',
            success: true,
            data: students,
            message: 'All students list fetched successfully'
        });
    }
);

// Get Student By ID
export const getStudentById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.params;
        
        // 1. studentId 
        const student = await Student.findOne({email: email}).populate('courses').populate("classes");
        if (!student) {
            throw new CustomError('Student not found', 404);
        }
        const attendInfo = await Attendance.findOne({student: student._id})
        // console.log("student => ", student, " email ->  ", email)

        res.status(200).json({
            status: 'success',
            success: true,
            data: {student, attendInfo},
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

// Get Students For Chart
export const getStudents = asyncHandler(async (req, res) => {

  const students = await Student.find();

  res.status(200).json({
    success: true,
    data: students,
    message: 'Students fetched successfully',
  });
});

// Get Students By Class
export const getStudentsByClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  const students = await Student.find({ class: classId });

  res.status(200).json({
    success: true,
    data: students,
    message: 'Students fetched successfully',
  });
});



// Get All by filter // class + course 
export const getAllStudentsFilter = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { current_page, per_page } = req.query;
        // console.log("body => ", req?.body)
        const { class: className, course } = req.body ;
        
        const page = Number(current_page) || 1;
        const limit = Number(per_page) || 5;
        const skip = (page - 1) * limit;

        let filter: any = {};

        // Filter by class name
        if (className && className.trim() !== '') {
            filter.classes = className;
        }

        // Filter by course (if courses is an array field in Student schema)
        if (course && course.trim() !== '') {
            filter.courses = course; 
        }

        // Total number of students matching the filter
        const total = await Student.countDocuments(filter);

        // Fetch students with pagination
        const students = await Student.find(filter)
            .populate('courses')
            .populate('classes')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        console.log(students);
        
        res.status(200).json({
            status: 'success',
            success: true,
            data: students,
            pagination: getPagination(total, page, limit),
            message: 'Students fetched successfully'
        });
    }
);