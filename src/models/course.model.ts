import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model('course', courseSchema);

export default Course;
