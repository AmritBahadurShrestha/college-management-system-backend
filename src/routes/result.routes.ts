import express from "express";
import { onlyAdmin } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";
import { createResult, deleteResult, generateClassReport, getAllResultsForTeacher, getOwnResults, updateResult } from "../controllers/result.controller";

const router = express.Router();

router.post("/", createResult); //Admin
router.get("/", getAllResultsForTeacher); //Teacher
router.get("/class/:classId/report", generateClassReport); //Teacher
router.patch("/:id", updateResult); //Admin
router.delete("/:id", deleteResult); //Admin
router.get("/student/results", getOwnResults); //Student

export default router;
