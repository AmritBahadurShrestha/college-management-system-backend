import express from "express";
import { createResult, deleteResult, generateClassReport, getAllResult, getAllResultsForTeacher, getMyResults, updateResult } from "../controllers/result.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdminsTeachers, onlyStudent, onlyTeacher } from "../types/global.types";

const router = express.Router();

router.post("/", createResult); //Admin
router.patch("/:id", updateResult); //Admin
router.delete("/:id", deleteResult); //Admin
router.get("/", getAllResult);
router.get("/my",authenticate(onlyStudent), getMyResults); //Student
router.get("/student/:id", authenticate(onlyTeacher), getAllResultsForTeacher); //Teacher
router.get("/class/:classId", authenticate(allAdminsTeachers), generateClassReport); //Admin Teacher

export default router;
