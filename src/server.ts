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


const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI ?? '';

const app = express();

// Connect DataBase
connectDatabase(DATABASE_URI);

// Use Middlewares
app.use(cors({
    origin: process.env.FRONT_END_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(helmet());
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb', extended: true}));

// Use Cookie Parser
app.use(cookieParser());

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

// Custom Error
app.all('/{*all}', (req: Request, res: Response, next: NextFunction) => {
    const message = `Cannot ${req.method} on ${req.originalUrl}`;
    const err: any = new CustomError(message, 404);
    next(err);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// Error Handling
app.use(errorHandler);
