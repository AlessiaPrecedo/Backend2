import { TicketRepository } from "../repositories/ticket.repository.js";

const ticketRepository = new TicketRepository();

export class TicketService {
  async getAllTickets() {
    const ticket = await ticketRepository.findAll();
    return ticket;
  }
  async getTicketByID(Id) {
    const ticket = await ticketRepository.findById(Id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    return ticket;
  }

  async createTicket(ticketData) {
    const newTicket = await ticketRepository.create(ticketData);
    return newTicket;
  }
  async updateTicket(id, TicketData) {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) {
      throw new Error("ticket not found");
    }
    const updatedticket = await ticketRepository.update(id, TicketData);
    return updatedticket;
  }

  async deleteTicket(id) {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    await ticketRepository.delete(id);
    return { message: "User successfully deleted" };
  }
}
