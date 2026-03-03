import express from "express";
import {
  changePassword,
  changeRole,
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  register,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/me", getCurrentUser);
router.post("/change-password", changePassword);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.patch("/changeRole", changeRole);

export default router;
