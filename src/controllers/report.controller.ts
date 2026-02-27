import { NextFunction, Request, Response } from 'express';
import CustomError from '../middlewares/error-handler.middleware';
import Attendance from '../models/attendance.model';
import Student from '../models/student.model';
import User from '../models/user.model';
import Teacher from '../models/teacher.model';
import { asyncHandler } from '../utils/async-handler.utils';
import { Role } from '../types/enum.types';
import Class from '../models/class.model';



// generateReport
export const generateReport = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const emailinfo = req?.params?.emailId;

    const userInfo = await User.findOne({ email: emailinfo });

    if (!userInfo) throw new Error("User not found");

    if (userInfo.role === Role.ADMIN)
      throw new Error("Admin report not allowed");

    let reportData: any = {};

    // 🔹 TEACHER REPORT
    if (userInfo.role === Role.TEACHER) {

      const teacherInfo = await Teacher.findOne({ email: emailinfo })
        .populate('courses');

      const classInfo = await Class.find({ teacher: teacherInfo?._id });

      const classIds = classInfo.map(cls => cls._id);

      const totalStudentCount = await Student.countDocuments({
        classes: { $in: classIds }
      });

      const totalStudent = await Student.countDocuments();

      const perc = totalStudent > 0
        ? (totalStudentCount / totalStudent) * 100
        : 0;

      reportData = {
        role: "TEACHER",
        teacherInfo,
        classInfo,
        totalStudentCount,
        percentage: perc,
      };
    }

    // 🔹 STUDENT REPORT
    if (userInfo.role === Role.STUDENT) {

      const studentInfo = await Student.findOne({ email: emailinfo })
        .populate('courses')
        .populate('classes');

      const attendance = await Attendance.find({
        student: studentInfo?._id
      });

      let present = 0;
      let absent = 0;

      attendance.forEach(item => {
        if (item.status === 'ABSENT') absent++;
        if (item.status === 'PRESENT') present++;
      });

      const total = present + absent;

      const presentPercent = total > 0
        ? (present / total) * 100
        : 0;

      reportData = {
        role: "STUDENT",
        studentInfo,
        attendance,
        present,
        absent,
        total,
        presentPercent,
      };
    }

    res.status(200).json({
      status: "success",
      success: true,
      data: reportData,
      message: "Report Generated Successfully",
    });
  }
);

