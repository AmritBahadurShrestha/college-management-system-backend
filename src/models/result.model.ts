import mongoose from "mongoose";
import { ExamType, ResultStatus } from "../types/enum.types";

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "class",
      required: true,
    },
    courses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "course",
        },
    ],
    program: {
      type: String,
      required: true,
      trim: true, // e.g. "BCA", "BBA", "B.Sc. CSIT"
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    examYear: {
      type: Number, // e.g. 2025 (year the exam was held)
      required: true,
    },
    examType: {
      type: String,
      enum: Object.values(ExamType),
      required: true,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 4.0,
    },
    overallStatus: {
      type: String,
      enum: Object.values(ResultStatus),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Result = mongoose.model("result", resultSchema);

export default Result;
