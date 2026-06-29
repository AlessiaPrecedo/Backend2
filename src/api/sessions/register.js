import { Router } from "express";
import { userExists } from "../../middlewares/session.middleware.js";
import { login, register } from "../../controllers/session.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", userExists, login);

export default router;
