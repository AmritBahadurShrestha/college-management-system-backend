"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allAST = exports.allAdminsTeachers = exports.onlyTeacher = exports.onlyStudent = exports.onlyAdmin = void 0;
const enum_types_1 = require("./enum.types");
exports.onlyAdmin = [enum_types_1.Role.ADMIN];
exports.onlyStudent = [enum_types_1.Role.STUDENT];
exports.onlyTeacher = [enum_types_1.Role.TEACHER];
exports.allAdminsTeachers = [...exports.onlyAdmin, ...exports.onlyTeacher];
exports.allAST = [...exports.onlyAdmin, ...exports.onlyStudent, ...exports.onlyTeacher];
