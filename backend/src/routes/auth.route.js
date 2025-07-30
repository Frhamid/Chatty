import express from "express";
import {
  login,
  logout,
  signup,
  onboard,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  signupValidator,
  loginValidator,
  onBoardValidator,
} from "../validators/authValidator.validator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/signup", signupValidator, validateRequest, signup);

router.post("/login", loginValidator, validateRequest, login);

router.post("/logout", logout);
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.post(
  "/onboarding",
  protectRoute,
  onBoardValidator,
  validateRequest,
  onboard
);

export default router;
