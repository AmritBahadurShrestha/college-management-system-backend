"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const courseSchema = new mongoose_1.default.Schema({
    code: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    creditHours: {
        type: Number,
        min: 1,
        max: 6,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        min: 1,
        max: 8,
        required: true
    },
    program: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const Course = mongoose_1.default.model('course', courseSchema);
exports.default = Course;
