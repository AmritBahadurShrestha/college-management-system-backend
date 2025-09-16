import mongoose from 'mongoose';
import { Gender } from '../types/enum.types';


const teacherSchema = new mongoose.Schema(
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
        gender: {
            type: String,
            enum: Object.values(Gender),
            required: true
        },
        department: {
            type: String,
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

const Teacher = mongoose.model('teacher', teacherSchema);

export default Teacher;
