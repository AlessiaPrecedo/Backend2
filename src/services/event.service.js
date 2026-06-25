import { EventRepository } from "../repositories/event.repository.js";

const eventRepository = new EventRepository();

export class EventService {
  async getAllEvents() {
    const Events = await eventRepository.findAll();
    return Events;
  }
  async getEventById(id) {
    const Event = await eventRepository.findById(id);
    if (!Event) {
      throw new Error("Event not found");
    }
    return Event;
  }

  async createEvent(eventData) {
    const existingEvent = await eventRepository.findByTitleAndDate(
      eventData.title,
      eventData.date,
    );
    if (existingEvent) {
      throw new Error("An event with that title already exists on that date.");
    }
    const newEvent = await eventRepository.create(eventData);
    return newEvent;
  }

  async updateEvent(id, EventData) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new Error("Event not found");
    }
    const updatedEvent = await eventRepository.update(id, EventData);
    return updatedEvent;
  }

  async deleteEvent(id) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new Error("Evento no encontrado");
    }
    await eventRepository.delete(id);
    return { message: "evento eliminado correctamente" };
  }
}

//logica de negocio de evento
