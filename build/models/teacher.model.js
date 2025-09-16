"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../types/enum.types");
const teacherSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: Object.values(enum_types_1.Gender),
        required: true
    },
    department: {
        type: String,
        required: true
    },
    courses: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'course'
        }
    ],
    profile: {
        path: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const Teacher = mongoose_1.default.model('teacher', teacherSchema);
exports.default = Teacher;
