import express from "express";
import {
  createAttendance,
  deleteAttendance,
  getAllAttendance,
  getAttendanceByClassId,
  getAttendanceByCourseId,
  getAttendanceById,
  getAttendanceByStudentId,
  updateAttendance,
} from "../controllers/attendance.controller";
import { allAdminsTeachers } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", createAttendance);
router.get("/", getAllAttendance);
router.get("/:id", getAttendanceById);
router.put("/:id", authenticate(allAdminsTeachers), updateAttendance);
router.delete("/:id", authenticate(allAdminsTeachers), deleteAttendance);
router.get("/student/:studentId", getAttendanceByStudentId);
router.get("/course/:courseId", getAttendanceByCourseId);
router.get("/class/:classId", getAttendanceByClassId);

export default router;
