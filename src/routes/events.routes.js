import { Router } from "express";
import {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  cancelEvent,
} from "../controllers/events.controllers.js";

const router = Router();

router.get("/", getEvents);
router.post("/", createEvent);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", cancelEvent);

export default router;
