import { Router } from "express";
import { validateLoginFields } from "../../middlewares/session.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import {
  login,
  register,
  current,
  logout,
} from "../../controllers/session.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", validateLoginFields, login);
router.get("/current", auth, current);
router.post("/logout", logout);

export default router;
