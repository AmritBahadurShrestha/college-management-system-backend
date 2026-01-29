"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = void 0;
const generatePassword = (length = 16) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*?/";
    let password = "";
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * chars.length);
        password += chars.charAt(index);
    }
    return password;
};
exports.generatePassword = generatePassword;
