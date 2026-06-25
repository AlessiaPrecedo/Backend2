import { EventModel } from "../models/event.model.js";

export class EventRepository {
  async findAll() {
    return await EventModel.find();
  }

  async findById(id) {
    return await EventModel.findById(id);
  }

  async findByOrganizer(organizerId) {
    return await EventModel.find({ organizer: organizerId });
  }

  async create(eventData) {
    return await EventModel.create(eventData);
  }
  async findByTitleAndDate(title, date) {
    return await EventModel.findOne({ title, date });
  }

  async update(id, eventData) {
    return await EventModel.findByIdAndUpdate(id, eventData, { new: true });
  }

  async delete(id) {
    return await EventModel.findByIdAndDelete(id);
  }
}
