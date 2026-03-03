import express from "express";
import {
  createClass,
  deleteClass,
  getAllClasses,
  getAllClassesList,
  getAllStuClass,
  getClassById,
  getTeaClass,
  updateClass
} from "../controllers/class.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { onlyAdmin } from "../types/global.types";

const router = express.Router();

router.post("/", authenticate(onlyAdmin), createClass);
router.get("/getStuClass/:className", getAllStuClass);
router.get("/getTeaClass/:className", getTeaClass);
router.get("/", getAllClasses);
router.get("/all", getAllClassesList);
router.get("/:id", getClassById);
router.put("/:id", authenticate(onlyAdmin), updateClass);
router.delete("/:id", authenticate(onlyAdmin), deleteClass);

export default router;
