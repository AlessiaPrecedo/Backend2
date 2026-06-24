import { Schema, model, Types } from "mongoose";

const ticketSchema = new Schema(
  {
    event: {
      type: Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true },
);

export const TicketModel = Model("Ticket", ticketSchema);
