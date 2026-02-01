import express from "express";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getAllStudentsFilter,
  getAllStudentsList,
  getStudentById,
  getStudents,
  getStudentsByClass,
  updateStudent,
} from "../controllers/student.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { uploader } from "../middlewares/uploader.middleware";
import { onlyAdmin } from "../types/global.types";

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
router.get("/class/:classId", getStudentsByClass);
router.post("/filter", getAllStudentsFilter);
router.get("/:email", getStudentById);
router.put(
  "/:id",
  authenticate(onlyAdmin),
  upload.single("profile"),
  updateStudent,
);
router.delete("/:id", authenticate(onlyAdmin), deleteStudent);

export default router;
