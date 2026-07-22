import "./setup.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateLoginFields } from "../src/middlewares/session.middleware.js";

function mockRes() {
  const res = {};
  res.statusCode = null;
  res.body = null;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  return res;
}

test("responde 400 si falta el email", () => {
  const req = { body: { password: "12345678" } };
  const res = mockRes();
  let nextCalled = false;

  validateLoginFields(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 400);
  assert.equal(nextCalled, false);
});

test("responde 400 si falta la password", () => {
  const req = { body: { email: "test@test.com" } };
  const res = mockRes();
  let nextCalled = false;

  validateLoginFields(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 400);
  assert.equal(nextCalled, false);
});

test("llama a next() cuando vienen ambos campos", () => {
  const req = { body: { email: "test@test.com", password: "12345678" } };
  const res = mockRes();
  let nextCalled = false;

  validateLoginFields(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, null);
});
