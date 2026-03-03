import express from "express";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getAllStudentsFilter,
  getAllStudentsList,
  getNextRegistrationNumber,
  getNextRollNumber,
  getStudentByEmail,
  getStudentById,
  getStudents,
  getStudentsByClass,
  updateStudent,
} from "../controllers/student.controller";
import { onlyAdmin } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";
import { uploader } from "../middlewares/uploader.middleware";

const router = express.Router();

const upload = uploader();

router.post(
  "/",
  authenticate(onlyAdmin),
  upload.single("profile"),
  createStudent,
);
router.get("/", getAllStudents);
router.get("/all", getAllStudentsList);
router.get("/chart", getStudents);
router.get("/next-roll-number", getNextRollNumber);
router.get("/next-registration-number", getNextRegistrationNumber);
router.get("/class/:classId", getStudentsByClass);
router.post("/filter", getAllStudentsFilter);
router.get("/email/:email", getStudentByEmail);
router.get("/:id", getStudentById);
router.put(
  "/:id",
  authenticate(onlyAdmin),
  upload.single("profile"),
  updateStudent,
);
router.delete("/:id", authenticate(onlyAdmin), deleteStudent);

export default router;
