import { NextFunction, Request, Response } from "express";
import CustomError from "../middlewares/error-handler.middleware";
import Class from "../models/class.model";
import Student from "../models/student.model";
import Teacher from "../models/teacher.model";
import { asyncHandler } from "../utils/async-handler.utils";
import { getPagination } from "../utils/pagination.utils";

// Create Class
export const createClass = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const classObj = await Class.create(payload);

    res.status(201).json({
      status: "success",
      success: true,
      data: classObj,
      message: "Class created successfully",
    });
  },
);

// get all student based class 
export const getAllStuClass = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    
    // 1. details req
    const  className = req?.params?.className;   

      const classInfo = await Class.findOne({_id: className})
      if(!classInfo) throw new Error("class is not Found ")
      
      
      const stuList = await Student.find({ classes: classInfo._id });
       

    res.status(201).json({
      status: "success",
      success: true,
      data: stuList,
      message: "all Student based class ",
    });
  },
);

export const getTeaClass = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get class name from body
    const  className = req?.params?.className;   

    // 2. Get all classes matching the name
    const classInfo = await Class.find({ _id: className });

    // Handle case where no classes are found
    if (!classInfo || classInfo.length === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    console.log("Class info => ", classInfo);

    // 3. Resolve all teacher queries in parallel using Promise.all
    
    const teacherPromises = classInfo.map((singleClass) =>
      Teacher.find({ courses: { $in: singleClass.courses } })
    );

    const teacherResults = await Promise.all(teacherPromises);

    // 4. Flatten the results (since Promise.all returns an array of arrays)
    const flatTeacherList = teacherResults.flat();

    res.status(200).json({
      status: "success",
      success: true,
      data: flatTeacherList,
      message: "All teachers retrieved for the specified classes",
    });
  }
);



// Get All Classes
export const getAllClasses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { current_page, per_page, query } = req.query;

    const page = Number(current_page) || 1;
    const limit = Number(per_page) || 5;
    const skip = (page - 1) * limit;

    const searchQuery = typeof query === "string" ? query : "";

    let filter: any = {};

    if (searchQuery) {
      filter.$or = [
        {
          name: { $regex: searchQuery, $options: "i" },
        },
      ];
    }

    // Total number of classes
    const total = await Class.countDocuments(filter);

    // Fetch classes with pagination
    const Classes = await Class.find(filter)
      .populate("courses")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      status: "success",
      success: true,
      data: Classes,
      pagination: getPagination(total, page, limit),
      message: "All classes fetched successfully",
    });
  },
);

// Get All Classes List Used In All Forms
export const getAllClassesList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const Classes = await Class.find()
      .populate("courses")
      .sort({ name: 1 });

    res.status(200).json({
      status: "success",
      success: true,
      data: Classes,
      message: "All classes list fetched successfully",
    });
  },
);

// Get Class By ID
export const getClassById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const classObj = await Class.findById(id).populate(
      "courses",
    );

    if (!classObj) {
      throw new CustomError("Class not found", 404);
    }

    res.status(200).json({
      status: "success",
      success: true,
      data: classObj,
      message: "Class fetched successfully",
    });
  },
);

// Update Class
export const updateClass = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true },
    ).populate("courses");

    if (!updatedClass) {
      throw new CustomError("Class not found", 404);
    }

    res.status(200).json({
      status: "success",
      success: true,
      data: updatedClass,
      message: "Class updated successfully",
    });
  },
);

// Delete Class
export const deleteClass = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      throw new CustomError("Class not found", 404);
    }

    res.status(200).json({
      status: "success",
      success: true,
      data: deletedClass,
      message: "Class deleted successfully",
    });
  },
);
