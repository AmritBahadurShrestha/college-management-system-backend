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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
// Get All Users
exports.getAllUsers = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find().sort({ createdAt: -1 });
    res.status(200).json({
        status: 'success',
        success: true,
        data: users,
        message: 'All users fetched successfully'
    });
}));
// Get User By ID
exports.getUserById = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_model_1.default.findById(id);
    if (!user) {
        throw new error_handler_middleware_1.default('User not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: user,
        message: 'User fetched successfully'
    });
}));
// Update User
exports.updateUser = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    if (!updatedUser) {
        throw new error_handler_middleware_1.default('User not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
    });
}));
// Delete User
exports.deleteUser = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedUser = yield user_model_1.default.findByIdAndDelete(id);
    if (!deletedUser) {
        throw new error_handler_middleware_1.default('User not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        data: deletedUser,
        message: 'User deleted successfully'
    });
}));
