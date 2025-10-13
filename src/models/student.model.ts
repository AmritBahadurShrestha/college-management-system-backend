import mongoose from 'mongoose';
import { Gender } from '../types/enum.types';

const studentSchema = new mongoose.Schema(
    {
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
            enum: Object.values(Gender),
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
                type: mongoose.Schema.Types.ObjectId,
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
    },
    {
        timestamps: true
    }
);

const Student = mongoose.model('student', studentSchema);

export default Student;
