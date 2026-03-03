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
        
        // get details 
        const { fullName, email, phone, address, dob, gender, rollNumber, registrationNumber, program, semester, courses, classes, role = 'STUDENT' } = req.body;

        // Handle profile upload
        const profile = req.file as Express.Multer.File;

        if (!profile) {
            throw new CustomError("Profile is required", 400);
        }

        // Creating Student Instance
        const student = new Student({ fullName, email, phone, address, dob, gender, rollNumber, registrationNumber, program, semester, classes, courses, role  });

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

        // usermodel into username, password, isnewAdded
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

        await sendEmail({
          to: student.email,
          subject: 'Your Login Credentials',
          html: `
          <div style="background-color:#f4f6f8;padding:30px;font-family:Arial,Helvetica,sans-serif;">
            <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.08);padding:30px;">

              <h2 style="color:#1f2937;text-align:center;margin-bottom:20px;">
                Welcome to College Management System
              </h2>

              <p style="color:#374151;font-size:14px;">
                Hello <strong>${student.fullName}</strong>,
              </p>

              <p style="color:#374151;font-size:14px;">
                Your account has been created successfully. Below are your login details:
              </p>

              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:15px;margin:20px 0;">
                <p style="margin:8px 0;font-size:14px;">
                  <strong>Email:</strong> ${student.email}
                </p>
                <p style="margin:8px 0;font-size:14px;">
                  <strong>Password:</strong> ${password}
                </p>
              </div>

              <p style="color:#dc2626;font-size:13px;">
                Please change your password immediately after logging in for security reasons.
              </p>

              <div style="text-align:center;margin-top:25px;">
                <a href="http://localhost:5173/login"
                   style="background:#2563eb;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;display:inline-block;">
                  Login Now
                </a>
              </div>

              <hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb;" />

              <p style="font-size:12px;color:#6b7280;text-align:center;">
                Copyright &copy; ${new Date().getFullYear()} College Management System<br/>
                This is an automated email. Please do not reply.
              </p>
            </div>
          </div>
          `,
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
            const programFilter = typeof req.query.program === 'string' ? req.query.program : ''
            const semesterFilter = req.query.semester ? Number(req.query.semester) : 0

            let filter:any={}

            if (searchQuery) {
                filter.$or = [
                    {
                        fullName: { $regex: searchQuery, $options: 'i' }
                    }
                ]
            }

            if (programFilter) {
                filter.program = programFilter
            }

            if (semesterFilter) {
                filter.semester = semesterFilter
            }

            // Total number of students
            const total = await Student.countDocuments(filter);

            // Fetch students with pagination
            const students = await Student.find(filter).populate('courses').populate("classes").sort({ createdAt: -1 }).limit(limit).skip(skip);


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
        const { id } = req.params;

        const student = await Student.findById(id).populate('courses').populate("classes");

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

// Get Student By Email
export const getStudentByEmail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.params;
        
        // student email
        const student = await Student.findOne({email: email}).populate('courses').populate("classes");
        if (!student) {
            throw new CustomError('Student not found', 404);
        }
        const attendInfo = await Attendance.findOne({student: student._id})

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

// Get Next Roll Number
export const getNextRollNumber = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const result = await Student.aggregate([
            {
                $match: {
                    rollNumber: /^\d{8}$/ // only match valid 8-digit roll numbers
                }
            },
            {
                $addFields: {
                    rollNumberInt: { $toLong: "$rollNumber" }
                }
            },
            {
                $group: {
                    _id: null,
                    maxRollNumber: { $max: "$rollNumberInt" }
                }
            }
        ]);

        let nextRollNumber: string;

        if (result.length > 0 && result[0].maxRollNumber) {
            const nextNumber = Number(result[0].maxRollNumber) + 1;

            // Ensure it never exceeds 8 digits (max: 99999999)
            if (nextNumber > 99999999) {
                res.status(400).json({
                    status: 'error',
                    success: false,
                    data: null,
                    message: 'Roll number limit reached (max 8 digits)'
                });
                return;
            }

            nextRollNumber = String(nextNumber).padStart(8, '0');
        } else {
            nextRollNumber = '21126100'; // first roll number if no students exist
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: nextRollNumber,
            message: 'Next roll number generated successfully'
        });
    }
);

// Get Next Registration Number
export const getNextRegistrationNumber = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const datePrefix = `${year}-${month}-${day}`;

    // Get global max serial across ALL dates
    const result = await Student.aggregate([
      {
        $match: {
          registrationNumber: /^\d{4}-\d{1,2}-\d{1,2}-\d+$/
        }
      },
      {
        $addFields: {
          serialInt: {
            $toLong: {
              $arrayElemAt: [{ $split: ["$registrationNumber", "-"] }, -1]
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          maxSerial: { $max: "$serialInt" }
        }
      }
    ]);

    let nextSerial = 1;

    if (result.length > 0 && result[0].maxSerial) {
      nextSerial = Number(result[0].maxSerial) + 1;
    }

    const nextRegistrationNumber = `${datePrefix}-${String(nextSerial).padStart(4, '0')}`;

    res.status(200).json({
      status: 'success',
      success: true,
      data: nextRegistrationNumber,
      message: 'Next registration number generated successfully',
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

        res.status(200).json({
            status: 'success',
            success: true,
            data: students,
            pagination: getPagination(total, page, limit),
            message: 'Students fetched successfully'
        });
    }
);
