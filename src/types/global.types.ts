import mongoose from 'mongoose';
import { Role } from './enum.types';

export interface IJWTPayload {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    role: Role;
    fullName: string;
}

export interface IJWTDecoderPayload extends IJWTPayload {
    exp: number; // token expiry
    iat: number; // issued at
}

export const onlyAdmin = [Role.ADMIN];
export const onlyStudent = [Role.STUDENT];
export const onlyTeacher = [Role.TEACHER];
export const allAdminsTeachers = [...onlyAdmin, ...onlyTeacher]
export const allAST = [...onlyAdmin, ...onlyStudent, ...onlyTeacher]
