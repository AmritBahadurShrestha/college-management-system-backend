import express from "express";
import {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  getAllTeachersList,
  getTeacherById,
  updateTeacher,
} from "../controllers/teacher.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { uploader } from "../middlewares/uploader.middleware";
import { onlyAdmin } from "../types/global.types";

const router = express.Router();

const upload = uploader();

router.post(
  "/",
  authenticate(onlyAdmin),
  upload.single("profile"),
  createTeacher,
);
router.get("/", getAllTeachers);
router.get("/all", getAllTeachersList);
router.get("/:email", getTeacherById);
router.put(
  "/:id",
  authenticate(onlyAdmin),
  upload.single("profile"),
  updateTeacher,
);
router.delete("/:id", authenticate(onlyAdmin), deleteTeacher);

export default router;
