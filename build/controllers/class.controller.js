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
exports.deleteClass = exports.updateClass = exports.getClassById = exports.getAllClasses = exports.createClass = void 0;
const class_model_1 = __importDefault(require("../models/class.model"));
const pagination_utils_1 = require("../utils/pagination.utils");
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
// Create Class
exports.createClass = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const classObj = yield class_model_1.default.create(payload);
    res.status(201).json({
        status: "success",
        success: true,
        data: classObj,
        message: "Class created successfully",
    });
}));
// Get All Classes
exports.getAllClasses = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { current_page, per_page } = req.query;
    const page = Number(current_page) || 1;
    const limit = Number(per_page) || 5;
    const skip = (page - 1) * limit;
    // Total number of classes
    const total = yield class_model_1.default.countDocuments();
    // Fetch classes with pagination
    const Classes = yield class_model_1.default.find().populate('students courses teacher').sort({ createdAt: -1 }).limit(limit).skip(skip);
    res.status(200).json({
        status: 'success',
        success: true,
        data: Classes,
        pagination: (0, pagination_utils_1.getPagination)(total, page, limit),
        message: 'All classes fetched successfully'
    });
}));
// Get Class By ID
exports.getClassById = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const classObj = yield class_model_1.default.findById(id).populate('students courses teacher');
    if (!classObj) {
        throw new error_handler_middleware_1.default('Class not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: classObj,
        message: 'Class fetched successfully'
    });
}));
// Update Class
exports.updateClass = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const updatedClass = yield class_model_1.default.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).populate('students courses teacher');
    if (!updatedClass) {
        throw new error_handler_middleware_1.default('Class not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: updatedClass,
        message: 'Class updated successfully'
    });
}));
// Delete Class
exports.deleteClass = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedClass = yield class_model_1.default.findByIdAndDelete(id);
    if (!deletedClass) {
        throw new error_handler_middleware_1.default('Class not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: deletedClass,
        message: 'Class deleted successfully'
    });
}));
