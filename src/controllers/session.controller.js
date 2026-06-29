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
    const user = await sessionService.login(req.body.email, req.body.password);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
// controlador de sessiones a desarrollar
