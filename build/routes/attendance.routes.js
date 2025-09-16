"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendance_controller_1 = require("../controllers/attendance.controller");
const global_types_1 = require("../types/global.types");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/', (0, auth_middleware_1.authenticate)(global_types_1.allAdminsTeachers), attendance_controller_1.createAttendance);
router.get('/', attendance_controller_1.getAllAttendance);
router.get('/:id', attendance_controller_1.getAttendanceById);
router.put('/:id', (0, auth_middleware_1.authenticate)(global_types_1.allAdminsTeachers), attendance_controller_1.updateAttendance);
router.delete('/:id', (0, auth_middleware_1.authenticate)(global_types_1.allAdminsTeachers), attendance_controller_1.deleteAttendance);
router.get('/student/:studentId', attendance_controller_1.getAttendanceByStudentId);
router.get('/course/:courseId', attendance_controller_1.getAttendanceByCourseId);
router.get('/class/:classId', attendance_controller_1.getAttendanceByClassId);
exports.default = router;
