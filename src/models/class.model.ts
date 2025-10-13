import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
    {
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
                type: mongoose.Schema.Types.ObjectId,
                ref: 'student'
            }
        ],
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'course'
            }
        ],
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teacher'
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

const Class = mongoose.model('class', classSchema);

export default Class;
