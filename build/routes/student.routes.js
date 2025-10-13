"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const student_controller_1 = require("../controllers/student.controller");
const global_types_1 = require("../types/global.types");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const uploader_middleware_1 = require("../middlewares/uploader.middleware");
const router = express_1.default.Router();
const upload = (0, uploader_middleware_1.uploader)();
router.post('/', (0, auth_middleware_1.authenticate)(global_types_1.onlyAdmin), upload.single('profile'), student_controller_1.createStudent);
router.get('/', student_controller_1.getAllStudents);
router.get('/all', student_controller_1.getAllStudentsList);
router.get('/:id', student_controller_1.getStudentById);
router.put('/:id', (0, auth_middleware_1.authenticate)(global_types_1.onlyAdmin), upload.single('profile'), student_controller_1.updateStudent);
router.delete('/:id', (0, auth_middleware_1.authenticate)(global_types_1.onlyAdmin), student_controller_1.deleteStudent);
exports.default = router;
