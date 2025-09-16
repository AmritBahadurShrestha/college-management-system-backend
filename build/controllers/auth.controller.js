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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getCurrentUser = exports.changePassword = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
// Register User
exports.register = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, phone, gender, role } = req.body;
    if (!password) {
        throw new error_handler_middleware_1.default('Password is required', 400);
    }
    // Create user
    const user = yield user_model_1.default.create({
        fullName,
        email,
        password,
        phone,
        gender,
        role,
    });
    const hashedPassword = yield (0, bcrypt_utils_1.hashPassword)(password);
    user.password = hashedPassword;
    yield user.save();
    const _a = user._doc, { password: pass } = _a, newUser = __rest(_a, ["password"]);
    res.status(201).json({
        status: 'success',
        success: true,
        data: newUser,
        message: 'User registered successfully'
    });
}));
// Login User
exports.login = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    if (!email) {
        throw new error_handler_middleware_1.default('Email is required', 400);
    }
    if (!password) {
        throw new error_handler_middleware_1.default('Password is required', 400);
    }
    // Check if user exists
    const user = yield user_model_1.default.findOne({ email }).select('+password');
    if (!user) {
        throw new error_handler_middleware_1.default('Invalid credentials', 400);
    }
    const isPassMatch = yield (0, bcrypt_utils_1.compareHash)(password, (_a = user.password) !== null && _a !== void 0 ? _a : '');
    if (!isPassMatch) {
        throw new error_handler_middleware_1.default('Invalid credentials', 400);
    }
    // Generate auth token
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
    };
    // Generate JWT token
    const access_token = (0, jwt_utils_1.generateToken)(payload);
    const _b = user._doc, { password: pass } = _b, loggedInUser = __rest(_b, ["password"]);
    res.cookie('access_token', access_token, {
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: true,
        maxAge: Number(process.env.COOKIE_EXPIRY) * 24 * 60 * 60 * 1000,
        sameSite: 'none'
    }).status(200).json({
        status: 'success',
        success: true,
        data: {
            data: loggedInUser,
            access_token
        },
        message: 'Login successful'
    });
}));
// Change Password
exports.changePassword = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, old_password, new_password } = req.body;
    if (!email) {
        throw new error_handler_middleware_1.default('Email is required', 400);
    }
    if (!old_password) {
        throw new error_handler_middleware_1.default('Old password is required', 400);
    }
    if (!new_password) {
        throw new error_handler_middleware_1.default('New password is required', 400);
    }
    // Check if user exists
    const user = yield user_model_1.default.findOne({ email }).select('+password');
    if (!user) {
        throw new error_handler_middleware_1.default('User not found', 400);
    }
    const isPassMatched = (0, bcrypt_utils_1.compareHash)(old_password, user.password);
    if (!isPassMatched) {
        throw new error_handler_middleware_1.default('Old password does not match.', 400);
    }
    user.password = yield (0, bcrypt_utils_1.hashPassword)(new_password);
    yield user.save();
    res.status(200).json({
        status: 'success',
        success: true,
        data: user,
        message: 'Password updated successfully'
    });
}));
// Get Current Logged-in User
exports.getCurrentUser = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        throw new error_handler_middleware_1.default('Unauthorized', 400);
    }
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.default('User not found', 400);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: user,
        message: 'Current user fetched successfully',
    });
}));
// Logout User
exports.logout = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('access_token', {
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: true,
        sameSite: 'none'
    }).status(200).json({
        status: 'success',
        success: true,
        data: null,
        message: 'Logout successful',
    });
}));
