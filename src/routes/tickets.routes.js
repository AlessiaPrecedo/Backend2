import { Router } from "express";
import {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  cancelTicket,
} from "../controllers/tickets.controller.js";

const router = Router();

router.get("/", getTickets);
router.post("/", createTicket);
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);
router.delete("/:id", cancelTicket);

export default router;
