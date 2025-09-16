"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const error_handler_middleware_1 = __importDefault(require("./error-handler.middleware"));
const user_model_1 = __importDefault(require("../models/user.model"));
const authenticate = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get token from cookies
            const access_token = req.cookies.access_token;
            if (!access_token) {
                throw new error_handler_middleware_1.default('Unauthorized. Access denied.', 401);
            }
            // Verify token
            const decodedData = (0, jwt_utils_1.verifyToken)(access_token);
            console.log(decodedData);
            if (Date.now() > decodedData.exp * 1000) {
                // Clear cookies
                res.clearCookie('access_token', {
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    httpOnly: true,
                    sameSite: 'none'
                });
                throw new error_handler_middleware_1.default('Session expired. Access denied.', 401);
            }
            const user = yield user_model_1.default.findById(decodedData._id);
            if (!user) {
                throw new error_handler_middleware_1.default('Unauthorized. Access denied.', 401);
            }
            if (roles && !roles.includes(decodedData.role)) {
                throw new error_handler_middleware_1.default('Unauthorized. Access denied.', 403);
            }
            req.user = {
                _id: decodedData._id,
                email: decodedData.email,
                role: decodedData.role,
                fullName: decodedData.fullName
            };
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.authenticate = authenticate;
