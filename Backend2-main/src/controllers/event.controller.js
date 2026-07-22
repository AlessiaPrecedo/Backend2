import { EventService } from "../services/event.service.js";

const eventService = new EventService();

export const getEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents();
    res.json({ status: "success", data: events });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getEventsById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.json({ status: "success", data: event });
  } catch (error) {
    const statusCode = error.message === "Event not found" ? 404 : 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
   const {title, description, category, date, location, capacity, price} = req.body;
   const event = await eventService.createEvent({
    title, description, category, date, location, capacity, price, organizer: req.user.id,
   })
   res.status(201).json({ status: "success", payload: {
    id:  event._id,
    title: event.title,
    organizer: event.organizer,
   },

   });
  } 
  catch (error) {
    const statusCode = error.message.includes("It already exists.") ? 400 : 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const existingEvent = await eventService.getEventById(req.params.id);

    const isOwner = existingEvent.organizer.toString() === req.user.id;
  if(req.user.role !== "admin" && !isOwner) {
    return res.status(403).json({
      status: "error",
      message: "No tenés permisos para modificar un evento que no te pertenece",
    });
  }
    const event = await eventService.updateEvent(req.params.id, req.body);
    res.json({ status: "success", data: event });
   
  } catch (error) {
    const statusCode = error.message === "Event not found" ? 404 : 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const existingEvent = await eventService.getEventById(req.params.id);

    const isOwner = existingEvent.organizer.toString() === req.user.id;

    if(req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({
        status: "error",
        message: "No tenés permisos para eliminar un evento que no te pertenece",
      });
    }

    const result = await eventService.deleteEvent(req.params.id);
    res.json({ status: "success", data: result });
  } catch (error) {
    const statusCode = error.message === "Event not found" ? 404 : 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

//controlador de eventos
