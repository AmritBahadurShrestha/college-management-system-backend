import { NextFunction, Request, Response } from "express";
import Result from "../models/result.model";
import { asyncHandler } from "../utils/async-handler.utils";
import CustomError from "../middlewares/error-handler.middleware";
import Student from "../models/student.model";

// Create Result
export const createResult = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      student,
      class: classId,
      courses,
      program,
      semester,
      examYear,
      examType,
      cgpa,
      overallStatus,
    } = req.body;

    const result = await Result.create({
      student,
      class: classId,
      courses, // should be array of course ObjectIds
      program,
      semester,
      examYear,
      examType,
      cgpa,
      overallStatus,
    });

    res.status(201).json({
      status: "success",
      success: true,
      data: result,
      message: "Result Created Successfully",
    });
  }
);

// Update Result
export const updateResult = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;

    const updatedResult = await Result.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true },
    );
    
   if (!updatedResult) {
      throw new CustomError("Course not found", 404);
    }

    res.status(200).json({
      status: "success",
      success: true,
      data: updatedResult,
      message: "Result updated successfully",
    });
  }
);

// Delete Result
export const deleteResult = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedResult = await Result.findById(id);

    if (!deletedResult) {
      throw new CustomError("Result not found", 404);
    }

    // if (!deletedResult.isActive) {
    //   return next(new CustomError("Result already deleted", 400));
    // }

    // deletedResult.isActive = false;
    await deletedResult.save();

    res.status(200).json({
      status: "success",
      success: true,
      data: deletedResult,
      message: "Result deleted successfully (soft delete)",
    });
  }
);

// Get All Results For Teacher
export const getAllResultsForTeacher = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    // Get student id
    const studentId = req.user?._id;

    // Verify student exists
    const student = await Student.findById(studentId);

    if (!student) {
        throw new CustomError("Student not found", 404);
    }

    const filter: any = {
        student: studentId,
    };

    if (req.query.class) filter.class = req.query.class;
    if (req.query.semester) filter.semester = req.query.semester;
    if (req.query.examYear) filter.examYear = req.query.examYear;
    if (req.query.examType) filter.examType = req.query.examType;
    if (req.query.course) filter.courses = req.query.course;

    const results = await Result.find(filter)
      .populate("student")
      .populate("class")
      .populate("courses");

    res.status(200).json({
      status: "success",
      success: true,
      data: results,
      message: "Results fetched Successfully",
    });
  }
);

// Generate Class Report
export const generateClassReport = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId } = req.params;
    const { semester, examYear, examType, course } = req.query;

    if (!classId) {
        throw new CustomError("Class ID is not found", 404);
    }

    const filter: any = { class: classId };

    if (semester) filter.semester = semester;
    if (examYear) filter.examYear = examYear;
    if (examType) filter.examType = examType;
    if (course) filter.courses = course;

    const results = await Result.find(filter);

    if (!results.length) {
      return res.status(200).json({
        status: "success",
        success: true,
        data: {
          totalStudents: 0,
          totalPass: 0,
          totalFail: 0,
          passPercentage: 0,
          failPercentage: 0,
        },
        message: "No results found for this class",
      });
    }

    let totalPass = 0;
    let totalFail = 0;

    results.forEach((r) => {
      if (r.overallStatus === "PASS") totalPass += 1;
      else if (r.overallStatus === "FAIL") totalFail += 1;
    });

    const totalStudents = results.length;
    const passPercentage = ((totalPass / totalStudents) * 100).toFixed(2);
    const failPercentage = ((totalFail / totalStudents) * 100).toFixed(2);

    res.status(200).json({
      status: "success",
      success: true,
      data: {
        totalStudents,
        totalPass,
        totalFail,
        passPercentage: Number(passPercentage),
        failPercentage: Number(failPercentage),
      },
      message: "Class report generated successfully",
    });
  }
);

// Get Own Results (Student)
export const getOwnResults = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    // Get student id
    const studentId = req.user?._id;

    // Verify student exists
    const student = await Student.findById(studentId);

    if (!student) {
      throw new CustomError("Student not found", 404);
    }

    // Build filter using studentId + query params
    const filter: any = { student: studentId };

    if (req.query.class) filter.class = req.query.class;
    if (req.query.semester) filter.semester = req.query.semester;
    if (req.query.examYear) filter.examYear = req.query.examYear;
    if (req.query.examType) filter.examType = req.query.examType;
    if (req.query.course) filter.courses = req.query.course;

    // Get results
    let results = await Result.find(filter)
      .populate("student")
      .populate("class")
      .populate("courses")
      .lean(); // <- important

    // Ensure marks are within 0–100
    results = results.map(r => {
      const validatedMarks = (r as any).marks.map((m: number) => (m < 0 || m > 100 ? 0 : m));
      return { ...r, marks: validatedMarks };
    });

    // Return
    res.status(200).json({
      status: "success",
      success: true,
      data: results,
      message: "Your results fetched successfully",
    });
  }
);
