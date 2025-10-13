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
exports.deleteStudent = exports.updateStudent = exports.getStudentById = exports.getAllStudentsList = exports.getAllStudents = exports.createStudent = void 0;
const student_model_1 = __importDefault(require("../models/student.model"));
const pagination_utils_1 = require("../utils/pagination.utils");
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const cloudinary_service_utils_1 = require("../utils/cloudinary-service.utils");
// import { sendEmail } from '../utils/nodemailer.utils';
// import { generate_student_account_email } from '../utils/email.utils';
// Register Student Profile
const folder_name = '/students';
// Create Student
exports.createStudent = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    // Handle profile upload
    const profile = req.file;
    if (!profile) {
        throw new error_handler_middleware_1.default("Profile is required", 400);
    }
    // Creating Student Instance
    const student = new student_model_1.default(payload);
    const { path, public_id } = yield (0, cloudinary_service_utils_1.uploadFile)(profile.path, folder_name);
    // Update new profile
    student.profile = {
        path,
        public_id,
    };
    yield student.save();
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
}));
// Get All Students
exports.getAllStudents = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { current_page, per_page } = req.query;
    const page = Number(current_page) || 1;
    const limit = Number(per_page) || 5;
    const skip = (page - 1) * limit;
    // Total number of students
    const total = yield student_model_1.default.countDocuments();
    // Fetch students with pagination
    const students = yield student_model_1.default.find().populate('courses').sort({ createdAt: -1 }).limit(limit).skip(skip);
    res.status(200).json({
        status: 'success',
        success: true,
        data: students,
        pagination: (0, pagination_utils_1.getPagination)(total, page, limit),
        message: 'All students fetched successfully'
    });
}));
// Get All Students List Used In All Forms
exports.getAllStudentsList = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield student_model_1.default.find().sort({ fullName: 1 });
    res.status(200).json({
        status: 'success',
        success: true,
        data: students,
        message: 'All students list fetched successfully'
    });
}));
// Get Student By ID
exports.getStudentById = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const student = yield student_model_1.default.findById(id).populate('courses');
    if (!student) {
        throw new error_handler_middleware_1.default('Student not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: student,
        message: 'Student fetched successfully'
    });
}));
// Update Student
exports.updateStudent = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const updatedStudent = yield student_model_1.default.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).populate('courses');
    if (!updatedStudent) {
        throw new error_handler_middleware_1.default('Student not found', 404);
    }
    // Handle profile upload
    const profile = req.file;
    if (profile) {
        const { path, public_id } = yield (0, cloudinary_service_utils_1.uploadFile)(profile.path, folder_name);
        // Delete old profile
        if (updatedStudent.profile && updatedStudent.profile.public_id) {
            yield (0, cloudinary_service_utils_1.deleteFiles)([updatedStudent.profile.public_id]);
        }
        // Update new profile
        updatedStudent.profile = {
            path,
            public_id,
        };
    }
    yield updatedStudent.save();
    res.status(200).json({
        status: 'success',
        success: true,
        data: updatedStudent,
        message: 'Student updated successfully'
    });
}));
// Delete Student
exports.deleteStudent = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const deletedStudent = yield student_model_1.default.findByIdAndDelete(id);
    if (!deletedStudent) {
        throw new error_handler_middleware_1.default('Student not found', 404);
    }
    // Delete profile
    if (deletedStudent.profile) {
        yield (0, cloudinary_service_utils_1.deleteFiles)([(_a = deletedStudent.profile) === null || _a === void 0 ? void 0 : _a.public_id]);
    }
    yield deletedStudent.deleteOne();
    res.status(200).json({
        status: 'success',
        success: true,
        data: deletedStudent,
        message: 'Student deleted successfully'
    });
}));
