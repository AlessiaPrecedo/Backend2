import express from "express";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import usersRoutes from "./routes/user.route.js";
import eventsRoutes from "./routes/event.route.js";
import ticketsRoutes from "./routes/ticket.route.js";
import sessionsRoutes from "./routes/session.route.js";

const app = express();
app.use(express.json());
app.use("/users", usersRoutes);
app.use("/events", eventsRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/sessions", sessionsRoutes);

import { errorHandler } from "./middlewares/errorHandler.js";
app.use(errorHandler);

app.listen(env.PORT, async () => {
  await connectDB();
  console.log("Conexión a la base de datos establecida");
  console.log(`Server running on port ${env.PORT}`);
});
