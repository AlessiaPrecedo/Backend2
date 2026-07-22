import "./setup.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { authorize } from "../src/middlewares/authorize.middleware.js";

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

test("responde 401 si no hay req.user (authorize sin auth previo)", () => {
  const req = {};
  const res = mockRes();
  let nextCalled = false;

  authorize("admin")(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("responde 403 si el rol no está permitido", () => {
  const req = { user: { id: "1", email: "a@a.com", role: "user" } };
  const res = mockRes();
  let nextCalled = false;

  authorize("organizer", "admin")(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

test("llama a next() si el rol está permitido", () => {
  const req = { user: { id: "1", email: "a@a.com", role: "organizer" } };
  const res = mockRes();
  let nextCalled = false;

  authorize("organizer", "admin")(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, null);
});

test("admin pasa cualquier lista que lo incluya", () => {
  const req = { user: { id: "1", email: "a@a.com", role: "admin" } };
  const res = mockRes();
  let nextCalled = false;

  authorize("admin")(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});
