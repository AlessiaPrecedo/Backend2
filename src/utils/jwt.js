import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateToken(payload) {
  // payload esperado: { id, email, role }
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  // tira una excepción si el token es inválido o expiró
  return jwt.verify(token, env.JWT_SECRET);
}
