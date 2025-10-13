"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacher_controller_1 = require("../controllers/teacher.controller");
const global_types_1 = require("../types/global.types");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const uploader_middleware_1 = require("../middlewares/uploader.middleware");
const router = express_1.default.Router();
const upload = (0, uploader_middleware_1.uploader)();
router.post('/', (0, auth_middleware_1.authenticate)(global_types_1.onlyAdmin), upload.single('profile'), teacher_controller_1.createTeacher);
router.get('/', teacher_controller_1.getAllTeachers);
router.get('/all', teacher_controller_1.getAllTeachersList);
router.get('/:id', teacher_controller_1.getTeacherById);
router.put('/:id', (0, auth_middleware_1.authenticate)(global_types_1.onlyAdmin), upload.single('profile'), teacher_controller_1.updateTeacher);
router.delete('/:id', (0, auth_middleware_1.authenticate)(global_types_1.onlyAdmin), teacher_controller_1.deleteTeacher);
exports.default = router;
