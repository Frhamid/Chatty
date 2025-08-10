import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Fields you don't want to send back
    const sensitiveFields = ["password", "confirmPassword"];

    const safeErrors = errors.array().map((err) => {
      if (sensitiveFields.includes(err.path)) {
        const { value, ...rest } = err; // Remove the value key
        return rest;
      }
      return err;
    });

    return res.status(400).json({ errors: safeErrors });
  }

  next();
};
