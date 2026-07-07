/**
 * @param {import ("express").Request} req
 * @param {import ("express").Request}res
 * @param {*} next
 */

import { SessionService } from "../services/session.service.js";

const sessionService = new SessionService();

export async function register(req, res, next) {
  try {
    const user = await sessionService.register(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const token = await sessionService.login(req.body.email, req.body.password);
    res.cookie("currentUser", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600000,
      secure: env.NODE_ENV === "production",
    });
    res.status(200).json({ status: "success", message: "Login successful" });
  } catch (error) {
    next(error);
  }
}

export async function current(req, res) {
  const { id, email, role } = req.user;
  res.status(200).json({ id, email, role });
}

export async function logout(req, res) {
  res.clearCookie("currentUser");
  res.status(200).json({ status: "success", message: "Logout successful" });
}

// controlador de sessiones a desarrollar
