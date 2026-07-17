import "./setup.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash, isValidPassword } from "../src/utils/utils.js";

test("createHash: el hash generado es distinto a la contraseña en texto plano", async () => {
  const hash = await createHash("miPassword123");
  assert.notEqual(hash, "miPassword123");
});

test("isValidPassword: devuelve true cuando la contraseña es correcta", async () => {
  const hash = await createHash("miPassword123");
  const valid = await isValidPassword("miPassword123", hash);
  assert.equal(valid, true);
});

test("isValidPassword: devuelve false cuando la contraseña es incorrecta", async () => {
  const hash = await createHash("miPassword123");
  const valid = await isValidPassword("otraPassword", hash);
  assert.equal(valid, false);
});
