"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const class_controller_1 = require("../controllers/class.controller");
const global_types_1 = require("../types/global.types");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/', (0, auth_middleware_1.authenticate)(global_types_1.allAdminsTeachers), class_controller_1.createClass);
router.get('/', class_controller_1.getAllClasses);
router.get('/:id', class_controller_1.getClassById);
router.put('/:id', (0, auth_middleware_1.authenticate)(global_types_1.allAdminsTeachers), class_controller_1.updateClass);
router.delete('/:id', (0, auth_middleware_1.authenticate)(global_types_1.allAdminsTeachers), class_controller_1.deleteClass);
exports.default = router;
