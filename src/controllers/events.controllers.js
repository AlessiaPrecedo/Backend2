export const getEvents = async (req, res) => {
  try {
    res.json({ message: "Listado de eventos" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener eventos" });
  }
};
export const getEventById = async (req, res) => {
  try {
    const evento = await EventModel.findById(req.params.id);
    res.json({ status: "success", data: evento });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener evento" });
  }
};
export const createEvent = async (req, res) => {
  try {
    const event = await EventModel.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Error al crear evento" });
  }
};
export const updateEvent = async (req, res) => {
  try {
    const event = await EventModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ status: "success", data: event });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar evento" });
  }
};
export const cancelEvent = async (req, res) => {
  try {
    const event = await EventModel.findByIdAndDelete(req.params.id);
    res.json({ status: "success", data: event });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar evento" });
  }
};
