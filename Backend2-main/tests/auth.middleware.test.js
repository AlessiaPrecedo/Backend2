import "./setup.js";
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { initializePassport } from "../src/config/passport.js";
import { auth } from "../src/middlewares/auth.middleware.js";
import { generateToken } from "../src/utils/jwt.js";

before(() => {
  initializePassport();
});

function mockRes() {
  const res = {};
  res.statusCode = null;
  res.body = null;

  let resolveDone;
  res._done = new Promise((resolve) => {
    resolveDone = resolve;
  });

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    resolveDone();
    return res;
  };
  return res;
}

test("responde 401 'No autenticado' si no hay cookie", async () => {
  const req = { cookies: {} };
  const res = mockRes();

  auth(req, res, () => {});
  await res._done;

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, "Not authenticated");
});

test("responde 401 'Token inválido o expirado' con un token roto", async () => {
  const req = { cookies: { currentUser: "esto-no-es-un-jwt-valido" } };
  const res = mockRes();

  auth(req, res, () => {});
  await res._done;

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, "Invalid or expired token");
});

test("llama a next() y setea req.user con un token válido", async () => {
  const token = generateToken({ id: "1", email: "a@a.com", role: "user" });
  const req = { cookies: { currentUser: token } };
  const res = mockRes();

  await new Promise((resolve) => {
    auth(req, res, () => {
      resolve();
    });
  });

  assert.equal(req.user.email, "a@a.com");
  assert.equal(res.statusCode, null);
});
