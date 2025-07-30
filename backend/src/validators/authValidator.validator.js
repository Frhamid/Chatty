import { body } from "express-validator";

export const signupValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidator = [
  body("email").notEmpty().withMessage("Email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const onBoardValidator = [
  body("fullName").notEmpty().withMessage("Email is required"),
  body("bio").notEmpty().withMessage("bio is required"),
  body("nativeLanguage").notEmpty().withMessage("nativeLanguage is required"),
  body("learningLanguage")
    .notEmpty()
    .withMessage("learningLanguage is required"),
  body("location").notEmpty().withMessage("Location is required"),
];
