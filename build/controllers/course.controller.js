"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.getAllCourses = exports.createCourse = void 0;
const course_model_1 = __importDefault(require("../models/course.model"));
const pagination_utils_1 = require("../utils/pagination.utils");
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
// Create Course
exports.createCourse = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const course = yield course_model_1.default.create(payload);
    res.status(201).json({
        status: "success",
        success: true,
        data: course,
        message: "Course created successfully",
    });
}));
// Get All Courses
exports.getAllCourses = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { current_page, per_page } = req.query;
    const page = Number(current_page) || 1;
    const limit = Number(per_page) || 5;
    const skip = (page - 1) * limit;
    // Total number of courses
    const total = yield course_model_1.default.countDocuments();
    // Fetch courses with pagination
    const courses = yield course_model_1.default.find().sort({ createdAt: -1 }).limit(limit).skip(skip);
    res.status(200).json({
        status: 'success',
        success: true,
        data: courses,
        pagination: (0, pagination_utils_1.getPagination)(total, page, limit),
        message: 'All courses fetched successfully'
    });
}));
// Get Course By ID
exports.getCourseById = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const course = yield course_model_1.default.findById(id);
    if (!course) {
        throw new error_handler_middleware_1.default('Course not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: course,
        message: 'Course fetched successfully'
    });
}));
// Update Course
exports.updateCourse = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const updatedCourse = yield course_model_1.default.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    if (!updatedCourse) {
        throw new error_handler_middleware_1.default('Course not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: updatedCourse,
        message: 'Course updated successfully'
    });
}));
// Delete Course
exports.deleteCourse = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedCourse = yield course_model_1.default.findByIdAndDelete(id);
    if (!deletedCourse) {
        throw new error_handler_middleware_1.default('Course not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: deletedCourse,
        message: 'Course deleted successfully'
    });
}));
