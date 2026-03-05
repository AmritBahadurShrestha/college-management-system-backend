import { NextFunction, Request, Response } from "express";
import CustomError from "../middlewares/error-handler.middleware";
import Result from "../models/result.model";
import Student from "../models/student.model";
import { asyncHandler } from "../utils/async-handler.utils";
import Mark from "../models/mark.model";
import { ResultStatus } from "../types/enum.types";
import { calculateGrade } from "../utils/gradeCalculator.utils";
import Class from "../models/class.model";

// Create Result
export const createResult = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { student, class: classId, program, semester, marks } = req.body;

    // Check student exists
    const studentExist = await Student.findById(student);
    if (!studentExist) {
      throw new CustomError("Student not found", 404);
    }

    // Normalize marks to array
    const marksArray = Array.isArray(marks) ? marks : [marks];

    // Validate each mark
    for (const [index, m] of marksArray.entries()) {
      if (!m.course) throw new CustomError(`marks[${index}].course is required`, 400);
      if (!m.examYear) throw new CustomError(`marks[${index}].examYear is required`, 400);
      if (!m.examType) throw new CustomError(`marks[${index}].examType is required`, 400);
      if (m.mark === undefined || m.mark === null)
        throw new CustomError(`marks[${index}].mark is required`, 400);
    }

    // Insert marks WITH calculated grade per course
    const createdMarks = await Mark.insertMany(
      marksArray.map((m: any) => ({
        student,
        course: m.course,
        examYear: m.examYear,
        examType: m.examType,
        mark: m.mark,
        grade: calculateGrade(m.mark),  // ← auto-calculated per course
        isAbsent: m.isAbsent || false,
      }))
    );

    // Calculate CGPA
    const totalMarks = createdMarks.reduce((sum, m) => sum + (m.mark ?? 0), 0);
    const average = totalMarks / createdMarks.length;
    const cgpa = parseFloat(((average / 100) * 4).toFixed(2));

    // Determine overall status — FAIL if any course has grade "F"
    const hasFail = createdMarks.some((m) => m.grade === "F");
    const overallStatus = hasFail ? ResultStatus.FAIL : ResultStatus.PASS;

    // Get mark IDs
    const markIds = createdMarks.map((m) => m._id);

    // Create result
    const result = await Result.create({
      student,
      class: classId,
      program,
      semester,
      marks: markIds,
      cgpa,
      overallStatus,
    });

    // Populate marks in the response
    const populated = await result.populate("marks");

    res.status(201).json({
      status: "success",
      success: true,
      data: populated,
      message: "Result Created Successfully",
    });
  }
);

// get All Result 
export const getAllResult = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await Result.find({ isActive: true })
      .populate("student", "fullName email")
      .populate("class", "name")
      .populate({
        path: "marks",
        populate: {
          path: "course",
          select: "name code"
        }
      });

    res.status(200).json({
      status: "success",
      success: true,
      data: result,
      message: "All Results Retrieved Successfully",
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
      payload,
      { new: true, runValidators: true }
    );

    if (!updatedResult) {
      throw new CustomError("Result not found", 404);
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

    const deletedResult = await Result.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      success: true,
      data: deletedResult,
      message: "Result deleted successfully",
    });
  }
);

// Get All Results For Teacher
export const getAllResultsForTeacher = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const studentId = req.params.id;

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      throw new CustomError("Student not found", 404);
    }

    // Base filter — always scope to this student
    const filter: any = {
      student: studentId,
      isActive: true,
    };

    // Optional filters that live on the Result model
    if (req.query.class)    filter.class    = req.query.class;
    if (req.query.semester) filter.semester = Number(req.query.semester);
    if (req.query.program)  filter.program  = req.query.program;

    const results = await Result.find(filter)
      .populate("student", "fullName email rollNumber registrationNumber program semester")
      .populate("class", "name")
      .populate({
        path: "marks",
        populate: {
          path: "course",
          select: "name code",
        },
      })
      .sort({ semester: 1, createdAt: -1 });

    res.status(200).json({
      status: "success",
      success: true,
      data: results,
      message: "Student results fetched successfully",
    });
  }
);

// Generate Class Report
export const generateClassReport = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId } = req.params;
    const { semester } = req.query; // only semester lives on Result

    if (!classId) {
      throw new CustomError("Class ID is required", 400);
    }

    // Verify class exists
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      throw new CustomError("Class not found", 404);
    }

    // Build filter — only fields that exist on Result model
    const filter: any = { class: classId, isActive: true };
    if (semester) filter.semester = Number(semester);

    const results = await Result.find(filter)
      .populate("student", "fullName email rollNumber")
      .populate({
        path: "marks",
        populate: { path: "course", select: "name code" },
      });

    if (!results.length) {
      return res.status(200).json({
        status: "success",
        success: true,
        data: {
          classInfo: classDoc,
          totalStudents: 0,
          totalPass: 0,
          totalFail: 0,
          passPercentage: 0,
          failPercentage: 0,
          avgCgpa: 0,
          results: [],
        },
        message: "No results found for this class",
      });
    }

    let totalPass = 0;
    let totalFail = 0;
    let cgpaSum = 0;

    results.forEach((r) => {
      if (r.overallStatus?.toUpperCase() === "PASS") totalPass++;
      else if (r.overallStatus?.toUpperCase() === "FAIL") totalFail++;
      cgpaSum += r.cgpa ?? 0;
    });

    const totalStudents = results.length;
    const passPercentage = Number(((totalPass / totalStudents) * 100).toFixed(2));
    const failPercentage = Number(((totalFail / totalStudents) * 100).toFixed(2));
    const avgCgpa = Number((cgpaSum / totalStudents).toFixed(2));

    res.status(200).json({
      status: "success",
      success: true,
      data: {
        classInfo: classDoc,
        totalStudents,
        totalPass,
        totalFail,
        passPercentage,
        failPercentage,
        avgCgpa,
        results, // full result list with student + marks populated
      },
      message: "Class report generated successfully",
    });
  }
);

// Get Own Results (Student)
export const getMyResults = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.user.email; // from JWT payload

    // Find the Student document by matching email
    const student = await Student.findOne({ email, isActive: true });

    if (!student) {
      throw new CustomError("Student profile not found for this account", 404);
    }

    // Query results using the Student's _id
    const results = await Result.find({
      student: student._id,
      isActive: true,
    })
      .populate("class", "name")
      .populate({
        path: "marks",
        populate: {
          path: "course",
          select: "name code",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      success: true,
      data: results,
      message: "My Results Retrieved Successfully",
    });
  }
);
