import express from "express";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import usersRoutes from "./routes/users.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import ticketsRoutes from "./routes/tickets.routes.js";
import sessionsRoutes from "./routes/session.routes.js";

const app = express();
app.use(express.json());
app.use("/users", usersRoutes);
app.use("/events", eventsRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/sessions", sessionsRoutes);

app.listen(env.PORT, async () => {
  await connectDB();
  console.log("Conexión a la base de datos establecida");
  console.log(`Server running on port ${env.PORT}`);
});
