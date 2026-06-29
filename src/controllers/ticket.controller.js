import { TicketService } from "../services/ticket.service.js";

const ticketService = new TicketService();

export const getTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.json({ status: "success", data: tickets });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketByID(req.params.id);
    res.json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving the ticket" });
  }
};

export const createTicket = async (req, res) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticketupdate = await ticketService.updateTicket(
      req.params.id,
      req.body,
    );

    res.json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ error: "Error updating the ticket" });
  }
};

export const cancelTicket = async (req, res) => {
  try {
    const cancelticket = await ticketService.deleteTicket(req.params.id);
    res.json({ status: "success", data: ticket });
  } catch (error) {
    res.status(500).json({ error: "Error cancelling the ticket" });
  }
};

//controlador de tickets
