import { Router } from "express";
import {
  getEvents,
  createEvent,
  getEventsById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const router = Router();

router.get("/", getEvents);
router.post("/", createEvent);
router.get("/:id", getEventsById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;

//ruta de eventos
