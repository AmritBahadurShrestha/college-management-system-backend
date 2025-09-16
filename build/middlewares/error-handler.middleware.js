"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.success = false;
        Error.captureStackTrace(this, CustomError);
    }
}
const errorHandler = (error, req, res, next) => {
    const statusCode = (error === null || error === void 0 ? void 0 : error.statusCode) || 500;
    const status = (error === null || error === void 0 ? void 0 : error.status) || 'error';
    const success = (error === null || error === void 0 ? void 0 : error.success) || false;
    const message = (error === null || error === void 0 ? void 0 : error.message) || 'Internal server error';
    res.status(statusCode).json({
        status,
        success,
        message,
        data: null
    });
};
exports.errorHandler = errorHandler;
exports.default = CustomError;
