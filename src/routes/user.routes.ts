import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { onlyAdmin } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticate(onlyAdmin), getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", authenticate(onlyAdmin), updateUser);
router.delete("/:id", authenticate(onlyAdmin), deleteUser);

export default router;
