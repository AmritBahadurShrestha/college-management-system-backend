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
exports.getDashboard = void 0;
const class_model_1 = __importDefault(require("../models/class.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const teacher_model_1 = __importDefault(require("../models/teacher.model"));
const student_model_1 = __importDefault(require("../models/student.model"));
const async_handler_utils_1 = require("../utils/async-handler.utils");
exports.getDashboard = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield student_model_1.default.countDocuments();
    const teachers = yield teacher_model_1.default.countDocuments();
    const courses = yield course_model_1.default.countDocuments();
    const classes = yield class_model_1.default.countDocuments();
    res.status(200).json({
        message: 'Dashboard data retrieved successfully',
        status: 'success',
        success: true,
        data: { students, teachers, courses, classes }
    });
}));
