import { Router } from "express";
import { login, register } from "../controllers/session.controller.js";
import { userExists } from "../middlewares/session.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", userExists, login);

export default router;
