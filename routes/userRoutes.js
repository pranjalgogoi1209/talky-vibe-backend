import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router.post("/register", UserController.userRegistration);

router.post("/login", UserController.userLogin);

export default router;
