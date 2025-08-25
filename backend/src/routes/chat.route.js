import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { deleteCall, getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
router.delete("/call/:type/:id", deleteCall);

export default router;
