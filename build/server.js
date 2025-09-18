"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_middleware_1 = __importStar(require("./middlewares/error-handler.middleware"));
const express_1 = __importDefault(require("express"));
const database_config_1 = require("./config/database.config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// Import Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const teacher_routes_1 = __importDefault(require("./routes/teacher.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const class_routes_1 = __importDefault(require("./routes/class.routes"));
const attendance_routes_1 = __importDefault(require("./routes/attendance.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const PORT = process.env.PORT;
const DATABASE_URI = (_a = process.env.DATABASE_URI) !== null && _a !== void 0 ? _a : '';
const app = (0, express_1.default)();
const allowed_origins = [
    process.env.FRONT_END_LOCAL_URL,
    process.env.FRONT_END_LIVE_URL
];
// Connect DataBase
(0, database_config_1.connectDatabase)(DATABASE_URI);
// Use Middlewares
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (allowed_origins.includes(origin)) {
            callback(null, true);
        }
        callback(new error_handler_middleware_1.default('Blocked by Cors error', 422));
    },
    credentials: true
}));
app.use((0, helmet_1.default)());
// Use Cookie Parser
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ limit: '5mb', extended: true }));
// Server Uploads
app.use('/api/uploads', express_1.default.static('uploads/'));
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server is running'
    });
});
// Use Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.use('/api/student', student_routes_1.default);
app.use('/api/teacher', teacher_routes_1.default);
app.use('/api/course', course_routes_1.default);
app.use('/api/class', class_routes_1.default);
app.use('/api/attendance', attendance_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
// Custom Error
app.use((req, res, next) => {
    const message = `Cannot ${req.method} on ${req.originalUrl}`;
    const err = new error_handler_middleware_1.default(message, 404);
    next(err);
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
// Error Handling
app.use(error_handler_middleware_1.errorHandler);
