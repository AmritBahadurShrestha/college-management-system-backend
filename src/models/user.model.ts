import mongoose from 'mongoose';
import { Gender, Role } from '../types/enum.types';


const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true
        },
        password: {
            type: String,
            select: false,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            enum: Object.values(Gender),
            required: true
        },
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.ADMIN
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

const User = mongoose.model('user', userSchema);

export default User;
