import mongoose from 'mongoose';
import { AttendanceStatus } from '../types/enum.types';

const attendanceSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student',
            required: true
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'class',
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'course',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(AttendanceStatus),
            required: true
        },
        remarks: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const Attendance = mongoose.model('attendance', attendanceSchema);

export default Attendance;
