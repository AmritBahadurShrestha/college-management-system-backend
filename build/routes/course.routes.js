"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controllers/course.controller");
const global_types_1 = require("../types/global.types");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/', (0, auth_middleware_1.authenticate)(global_types_1.onlyAdmin), course_controller_1.createCourse);
router.get('/', course_controller_1.getAllCourses);
router.get('/all', course_controller_1.getAllCoursesList);
router.get('/:id', course_controller_1.getCourseById);
router.put('/:id', (0, auth_middleware_1.authenticate)(global_types_1.onlyAdmin), course_controller_1.updateCourse);
router.delete('/:id', (0, auth_middleware_1.authenticate)(global_types_1.onlyAdmin), course_controller_1.deleteCourse);
exports.default = router;
