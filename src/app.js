import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initializePassport } from "./config/passport.js";
import usersRoutes from "./routes/user.route.js";
import eventsRoutes from "./routes/event.route.js";
import ticketsRoutes from "./routes/ticket.route.js";
import sessionsRoutes from "./routes/sessions.router.js";
import { ErrorHandler } from "./middlewares/ErrorHandler.js";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/users", usersRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/events", eventsRoutes);
app.use("/tickets", ticketsRoutes);

initializePassport(); // configura Passport
app.use(passport.initialize()); // Inicializa Passport en la aplicación

app.use(ErrorHandler);

app.listen(env.PORT, async () => {
  await connectDB();
  console.log("Connected");
  console.log(`Server running on port ${env.PORT}`);
});

//conexion final de las capas
