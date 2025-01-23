import express from "express";
import UserController from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const router = express.Router();

// public routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.post(
  "/send-password-reset-email",
  UserController.sendPasswordResetEmail
);
router.post("/reset-password/:_id/:token", UserController.resetPassword);

// protected routes
router.get("/data", authMiddleware, UserController.userData);

export default router;
