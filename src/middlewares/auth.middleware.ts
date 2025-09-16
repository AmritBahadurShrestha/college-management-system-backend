import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { Role } from '../types/enum.types';
import CustomError from './error-handler.middleware';
import User from '../models/user.model';


export const authenticate = (roles?: Role[]) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            // Get token from cookies
            const access_token = req.cookies.access_token;

            if (!access_token) {
                throw new CustomError('Unauthorized. Access denied.', 401);
            }

            // Verify token
            const decodedData = verifyToken(access_token);

            console.log(decodedData);

            if (Date.now() > decodedData.exp * 1000) {

                // Clear cookies
                res.clearCookie('access_token', {
                    secure:process.env.NODE_ENV === 'development' ? false : true,
                    httpOnly: true,
                    sameSite: 'none'
                })
                throw new CustomError('Session expired. Access denied.', 401);
            }

            const user = await User.findById(decodedData._id);

            if (!user) {
                throw new CustomError('Unauthorized. Access denied.', 401);
            }

            if (roles && !roles.includes(decodedData.role)) {
                throw new CustomError('Unauthorized. Access denied.', 403);
            }

            req.user = {
                _id: decodedData._id,
                email: decodedData.email,
                role: decodedData.role,
                fullName: decodedData.fullName
            };

            next();

        } catch (error) {
            next(error);
        }
    };
};
