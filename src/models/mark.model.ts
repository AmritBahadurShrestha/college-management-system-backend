import mongoose from "mongoose";
import { ExamType } from "../types/enum.types";

const markSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    examYear: {
      type: Number,
      required: true,
    },
    examType: {
      type: String,
      enum: Object.values(ExamType),
      required: true,
    },
    mark: {
      type: Number,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,

    },
    isAbsent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Mark = mongoose.model("mark", markSchema);

export default Mark;
