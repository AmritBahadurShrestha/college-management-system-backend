import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/database.config";
import express, { NextFunction, Request, Response } from "express";
import CustomError, { errorHandler } from "./middlewares/error-handler.middleware";

// Import Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import classRoutes from "./routes/class.routes";
import courseRoutes from "./routes/course.routes";
import studentRoutes from "./routes/student.routes";
import teacherRoutes from "./routes/teacher.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import attendanceRoutes from "./routes/attendance.routes";
import reportRoutes from "./routes/report.routes";
import resultRoutes from "./routes/result.routes";

const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI ?? "";

const app = express();

const allowed_origins = [
  process.env.FRONT_END_LOCAL_URL,
  process.env.FRONT_END_LIVE_URL,
];

// Connect DataBase
connectDatabase(DATABASE_URI);

// Use Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, mobile apps, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowed_origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new CustomError("Blocked by CORS", 403));
      }
    },
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-access-token",
      "access_token",
      "Cookie",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }),
);

app.use(helmet());

// Use Cookie Parser
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Server Uploads
app.use("/api/uploads", express.static("uploads/"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is running",
  });
});

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/class", classRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/result", resultRoutes);

// 404 Handler for routes that don't exist
app.use((req: Request, res: Response, next: NextFunction) => {
  const message = `Cannot ${req.method} on ${req.originalUrl}`;
  const err: any = new CustomError(message, 404);
  next(err);
});

// Error Handler MUST be before app.listen()
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
