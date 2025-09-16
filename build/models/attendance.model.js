"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../types/enum.types");
const attendanceSchema = new mongoose_1.default.Schema({
    student: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    class: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'class',
        required: true
    },
    course: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(enum_types_1.AttendanceStatus),
        required: true
    },
    remarks: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});
const Attendance = mongoose_1.default.model('attendance', attendanceSchema);
exports.default = Attendance;
