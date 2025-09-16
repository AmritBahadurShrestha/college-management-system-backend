"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../types/enum.types");
const studentSchema = new mongoose_1.default.Schema({
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
    address: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: Object.values(enum_types_1.Gender),
        required: true
    },
    rollNumber: {
        type: String,
        unique: true,
        required: true
    },
    registrationNumber: {
        type: String,
        unique: true,
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
const Student = mongoose_1.default.model('student', studentSchema);
exports.default = Student;
