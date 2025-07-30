import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { signupValidator } from "../validators/authValidator.validator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/signup", signupValidator, validateRequest, signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
