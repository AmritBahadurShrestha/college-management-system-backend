import CustomError, { errorHandler } from './middlewares/error-handler.middleware';
import express, { Request, Response, NextFunction } from 'express';
import { connectDatabase } from './config/database.config';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';

// Import Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import studentRoutes from './routes/student.routes';
import teacherRoutes from './routes/teacher.routes';
import courseRoutes from './routes/course.routes';
import classRoutes from './routes/class.routes';
import attendanceRoutes from './routes/attendance.routes';
import dashboardRoutes from './routes/dashboard.routes';
import studentRoute from './routes/student.routes';

const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI ?? '';

const app = express();

const allowed_origins = [
    process.env.FRONT_END_LOCAL_URL,
    process.env.FRONT_END_LIVE_URL
]

// Connect DataBase
connectDatabase(DATABASE_URI);

// Use Middlewares
app.use(cors({
    origin: (origin, callback) => {
        if (allowed_origins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new CustomError('Blocked by Cors errors', 422))
        }
        
    },
    credentials: true
}));

app.use(helmet());

// Use Cookie Parser
app.use(cookieParser());
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb', extended: true}));

// Server Uploads
app.use('/api/uploads', express.static('uploads/'));

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Server is running'
    });
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/class', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/students', studentRoute);

// Custom Error
app.use((req: Request, res: Response, next: NextFunction) => {
    const message = `Cannot ${req.method} on ${req.originalUrl}`;
    const err: any = new CustomError(message, 404);
    next(err);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// Error Handling
app.use(errorHandler);
