"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const classSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    program: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        min: 1,
        max: 8,
        required: true
    },
    students: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'student'
        }
    ],
    courses: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'course'
        }
    ],
    teacher: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'teacher'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const Class = mongoose_1.default.model('class', classSchema);
exports.default = Class;
