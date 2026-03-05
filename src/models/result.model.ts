import mongoose from "mongoose";
import { ResultStatus } from "../types/enum.types";

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
    marks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mark",
      },
    ],
    program: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
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
