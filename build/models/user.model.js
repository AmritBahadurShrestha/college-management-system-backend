"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../types/enum.types");
const userSchema = new mongoose_1.default.Schema({
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
        enum: Object.values(enum_types_1.Gender),
        required: true
    },
    role: {
        type: String,
        enum: Object.values(enum_types_1.Role),
        default: enum_types_1.Role.ADMIN
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const User = mongoose_1.default.model('user', userSchema);
exports.default = User;
