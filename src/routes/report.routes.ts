import express from "express";

import { generateReport } from "../controllers/report.controller";


const router = express.Router();


router.get("/:emailId", generateReport);


export default router;
