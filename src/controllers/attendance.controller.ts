import Attendance from '../models/attendance.model';
import { Request, Response, NextFunction } from 'express';
import { getPagination } from '../utils/pagination.utils';
import { asyncHandler } from '../utils/async-handler.utils';
import CustomError from '../middlewares/error-handler.middleware';

// Mark Attendance
export const createAttendance = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;

        const attendance = await Attendance.create(payload);

        res.status(201).json({
            status: "success",
            success: true,
            data: attendance,
            message: "Attendance marked successfully",
        });
    }
);

// Get All Attendance Records
export const getAllAttendance = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const { current_page, per_page } = req.query;

        const page = Number(current_page) || 1;
        const limit = Number(per_page) || 5;
        const skip = (page - 1) * limit;

        // let filter:any ={}

        // if(query){
        //     filter.$or=[
        //         {
        //           name: query,
        //           option: "i" 
        //         }
        //     ]
        // }
        
        // Total number of records
        const total = await Attendance.countDocuments();

        // Fetch records with pagination
        const records = await Attendance.find({}).populate('student class course').sort({ createdAt: -1 }).limit(limit).skip(skip);

        res.status(200).json({
            status: 'success',
            success: true,
            data: records,
            pagination: getPagination(total, page, limit),
            message: 'All attendance records fetched successfully'
        });
    }
);

// Get Attendance By ID
export const getAttendanceById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const record = await Attendance.findById(id).populate('student class course');

        if (!record) {
            throw new CustomError('Attendance record not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: record,
            message: 'Attendance record fetched successfully'
        });
    }
);

// Update Attendance
export const updateAttendance = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const payload = req.body;

        const updatedRecord = await Attendance.findByIdAndUpdate(
            id,
            { $set: payload },
            { new: true, runValidators: true }
        ).populate('student class course');

        if (!updatedRecord) {
            throw new CustomError('Attendance record not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: updatedRecord,
            message: 'Attendance updated successfully'
        });
    }
);

// Delete Attendance
export const deleteAttendance = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deletedRecord = await Attendance.findByIdAndDelete(id);

        if (!deletedRecord) {
            throw new CustomError('Attendance record not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: deletedRecord,
            message: 'Attendance deleted successfully'
        });
    }
);

// Get Attendance By Student ID
export const getAttendanceByStudentId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { studentId } = req.params;

        const record = await Attendance.find({ student: studentId })
            .populate('course')
            .populate('student')
            .populate('class');

        res.status(200).json({
            status: 'success',
            success: true,
            data: record,
            message: 'Attendance records for the student fetched successfully'
        });
    }
);

// Get Attendance By Course ID
export const getAttendanceByCourseId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { courseId } = req.params;

        const record = await Attendance.find({ course: courseId })
            .populate('student')
            .populate('course')
            .populate('class');

        res.status(200).json({
            status: 'success',
            success: true,
            data: record,
            message: 'Attendance records for the course fetched successfully'
        });
    }
);

// Get Attendance By Class ID
export const getAttendanceByClassId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { classId } = req.params;

        const record = await Attendance.find({ class: classId })
            .populate('student')
            .populate('class')
            .populate('course');

        res.status(200).json({
            status: 'success',
            success: true,
            data: record,
            message: 'Attendance records for the class fetched successfully'
        });
    }
);




export const markAttendance = asyncHandler(async (req, res) => {
  const { studentId, classId, courseId, date, status } = req.body;

  const attendance = await Attendance.findOneAndUpdate(
    { student: studentId, course: courseId, date },
    {
      student: studentId,
      class: classId,
      course: courseId,
      date,
      status,
      markedBy: req.user._id
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    data: attendance,
    message: 'Attendance updated'
  });
});
