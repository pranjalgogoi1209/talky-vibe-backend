import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router.post("/create-user", UserController.createUser);

export default router;
