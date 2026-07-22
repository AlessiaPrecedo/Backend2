import "./setup.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { generateToken, verifyToken } from "../src/utils/jwt.js";

test("generateToken + verifyToken: hace round-trip con el payload correcto", () => {
  const token = generateToken({
    id: "123",
    email: "test@test.com",
    role: "user",
  });
  const decoded = verifyToken(token);

  assert.equal(decoded.id, "123");
  assert.equal(decoded.email, "test@test.com");
  assert.equal(decoded.role, "user");
});

test("el payload del token nunca incluye la contraseña", () => {
  const token = generateToken({
    id: "123",
    email: "test@test.com",
    role: "user",
  });
  const decoded = verifyToken(token);

  assert.equal(decoded.password, undefined);
});

test("verifyToken lanza un error si el token fue manipulado", () => {
  const token = generateToken({
    id: "123",
    email: "test@test.com",
    role: "user",
  });
  const tampered = token.slice(0, -1) + (token.endsWith("a") ? "b" : "a");

  assert.throws(() => verifyToken(tampered));
});

test("verifyToken lanza un error si el token está expirado", () => {
  const expiredToken = jwt.sign(
    { id: "123", email: "test@test.com", role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: -10 }, // ya vencido
  );

  assert.throws(() => verifyToken(expiredToken));
});
