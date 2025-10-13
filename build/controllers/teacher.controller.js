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
exports.deleteTeacher = exports.updateTeacher = exports.getTeacherById = exports.getAllTeachersList = exports.getAllTeachers = exports.createTeacher = void 0;
const teacher_model_1 = __importDefault(require("../models/teacher.model"));
const pagination_utils_1 = require("../utils/pagination.utils");
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const cloudinary_service_utils_1 = require("../utils/cloudinary-service.utils");
// Register Teacher Profile
const folder_name = '/teachers';
// Create Teacher
exports.createTeacher = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    // Handle profile upload
    const profile = req.file;
    if (!profile) {
        throw new error_handler_middleware_1.default("Profile is required", 400);
    }
    // Creating Teacher Instance
    const teacher = new teacher_model_1.default(payload);
    const { path, public_id } = yield (0, cloudinary_service_utils_1.uploadFile)(profile.path, folder_name);
    // Update new profile
    teacher.profile = {
        path,
        public_id,
    };
    yield teacher.save();
    res.status(201).json({
        status: "success",
        success: true,
        data: teacher,
        message: "Teacher created successfully",
    });
}));
// Get All Teachers
exports.getAllTeachers = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { current_page, per_page } = req.query;
    const page = Number(current_page) || 1;
    const limit = Number(per_page) || 5;
    const skip = (page - 1) * limit;
    // Total number of teachers
    const total = yield teacher_model_1.default.countDocuments();
    // Fetch teachers with pagination
    const teachers = yield teacher_model_1.default.find().populate('courses').sort({ createdAt: -1 }).limit(limit).skip(skip);
    res.status(200).json({
        status: 'success',
        success: true,
        data: teachers,
        pagination: (0, pagination_utils_1.getPagination)(total, page, limit),
        message: 'All teachers fetched successfully'
    });
}));
// Get All Teachers List Used In All Forms
exports.getAllTeachersList = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const teachers = yield teacher_model_1.default.find().sort({ fullName: 1 });
    res.status(200).json({
        status: 'success',
        success: true,
        data: teachers,
        message: 'All teachers list fetched successfully'
    });
}));
// Get Teacher By ID
exports.getTeacherById = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const teacher = yield teacher_model_1.default.findById(id).populate('courses');
    if (!teacher) {
        throw new error_handler_middleware_1.default('Teacher not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: teacher,
        message: 'Teacher fetched successfully'
    });
}));
// Update Teacher
exports.updateTeacher = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const updatedTeacher = yield teacher_model_1.default.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).populate('courses');
    if (!updatedTeacher) {
        throw new error_handler_middleware_1.default('Teacher not found', 404);
    }
    // Handle profile upload
    const profile = req.file;
    if (profile) {
        const { path, public_id } = yield (0, cloudinary_service_utils_1.uploadFile)(profile.path, folder_name);
        // Delete old profile
        if (updatedTeacher.profile && updatedTeacher.profile.public_id) {
            yield (0, cloudinary_service_utils_1.deleteFiles)([updatedTeacher.profile.public_id]);
        }
        // Update new profile
        updatedTeacher.profile = {
            path,
            public_id,
        };
    }
    yield updatedTeacher.save();
    res.status(200).json({
        status: 'success',
        success: true,
        data: updatedTeacher,
        message: 'Teacher updated successfully'
    });
}));
// Delete Teacher
exports.deleteTeacher = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const deletedTeacher = yield teacher_model_1.default.findByIdAndDelete(id);
    if (!deletedTeacher) {
        throw new error_handler_middleware_1.default('Teacher not found', 404);
    }
    // Delete profile
    if (deletedTeacher.profile) {
        yield (0, cloudinary_service_utils_1.deleteFiles)([(_a = deletedTeacher.profile) === null || _a === void 0 ? void 0 : _a.public_id]);
    }
    yield deletedTeacher.deleteOne();
    res.status(200).json({
        status: 'success',
        success: true,
        data: deletedTeacher,
        message: 'Teacher deleted successfully'
    });
}));
