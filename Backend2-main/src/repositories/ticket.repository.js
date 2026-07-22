import { TicketModel } from "../models/ticket.model.js";

export class TicketRepository {
  async findAll() {
    return await TicketModel.find();
  }
  async findById(id) {
    return await TicketModel.findById(id);
  }
  async findByUser(userId) {
    return await TicketModel.find({ user: userId });
  }
  async findByEvent(eventId) {
    return await TicketModel.find({ event: eventId });
  }
  async findByUserAndEvent(userId, eventId) {
    return await TicketModel.findOne({ user: userId, event: eventId });
  }
  async create(ticketData) {
    return await TicketModel.create(ticketData);
  }
  async update(id, ticketData) {
    return await TicketModel.findByIdAndUpdate(id, ticketData, { new: true });
  }
  async delete(id) {
    return await TicketModel.findByIdAndDelete(id);
  }
}
