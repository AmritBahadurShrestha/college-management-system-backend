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
exports.getAttendanceByClassId = exports.getAttendanceByCourseId = exports.getAttendanceByStudentId = exports.deleteAttendance = exports.updateAttendance = exports.getAttendanceById = exports.getAllAttendance = exports.createAttendance = void 0;
const attendance_model_1 = __importDefault(require("../models/attendance.model"));
const pagination_utils_1 = require("../utils/pagination.utils");
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
// Mark Attendance
exports.createAttendance = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const attendance = yield attendance_model_1.default.create(payload);
    res.status(201).json({
        status: "success",
        success: true,
        data: attendance,
        message: "Attendance marked successfully",
    });
}));
// Get All Attendance Records
exports.getAllAttendance = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const total = yield attendance_model_1.default.countDocuments();
    // Fetch records with pagination
    const records = yield attendance_model_1.default.find({}).populate('student class course').sort({ createdAt: -1 }).limit(limit).skip(skip);
    res.status(200).json({
        status: 'success',
        success: true,
        data: records,
        pagination: (0, pagination_utils_1.getPagination)(total, page, limit),
        message: 'All attendance records fetched successfully'
    });
}));
// Get Attendance By ID
exports.getAttendanceById = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const record = yield attendance_model_1.default.findById(id).populate('student class course');
    if (!record) {
        throw new error_handler_middleware_1.default('Attendance record not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: record,
        message: 'Attendance record fetched successfully'
    });
}));
// Update Attendance
exports.updateAttendance = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const updatedRecord = yield attendance_model_1.default.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).populate('student class course');
    if (!updatedRecord) {
        throw new error_handler_middleware_1.default('Attendance record not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: updatedRecord,
        message: 'Attendance updated successfully'
    });
}));
// Delete Attendance
exports.deleteAttendance = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedRecord = yield attendance_model_1.default.findByIdAndDelete(id);
    if (!deletedRecord) {
        throw new error_handler_middleware_1.default('Attendance record not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: deletedRecord,
        message: 'Attendance deleted successfully'
    });
}));
// Get Attendance By Student ID
exports.getAttendanceByStudentId = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    const record = yield attendance_model_1.default.find({ student: studentId })
        .populate('course')
        .populate('student')
        .populate('class');
    res.status(200).json({
        status: 'success',
        success: true,
        data: record,
        message: 'Attendance records for the student fetched successfully'
    });
}));
// Get Attendance By Course ID
exports.getAttendanceByCourseId = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const record = yield attendance_model_1.default.find({ course: courseId })
        .populate('student')
        .populate('course')
        .populate('class');
    res.status(200).json({
        status: 'success',
        success: true,
        data: record,
        message: 'Attendance records for the course fetched successfully'
    });
}));
// Get Attendance By Class ID
exports.getAttendanceByClassId = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { classId } = req.params;
    const record = yield attendance_model_1.default.find({ class: classId })
        .populate('student')
        .populate('class')
        .populate('course');
    res.status(200).json({
        status: 'success',
        success: true,
        data: record,
        message: 'Attendance records for the class fetched successfully'
    });
}));
