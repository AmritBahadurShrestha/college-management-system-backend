import { Request, Response, NextFunction } from 'express';


class CustomError extends Error {
    statusCode: number;
    status: 'error' | 'fail';
    success: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.success = false;
        Error.captureStackTrace(this, CustomError);
    }
}

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error?.statusCode || 500;
    const status = error?.status || 'error';
    const success = error?.success || false;
    const message = error?.message || 'Internal server error';

    res.status(statusCode).json({
        status,
        success,
        message,
        data: null
    });
};

export default CustomError;
