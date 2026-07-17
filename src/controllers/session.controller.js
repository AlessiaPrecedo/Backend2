/**
 * @param {import ("express").Request} req
 * @param {import ("express").Request}res
 * @param {*} next
 */

import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import { env } from "../config/env.js";

export function register(req, res, next) {
  passport.authenticate("register", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "No se pudo registrar el usuario" });
    }

    const { password, ...userWithoutPassword } = user.toObject();
    res.status(201).json({ status: "success", payload: userWithoutPassword });
  })(req, res, next);
}

export function login(req, res, next) {
  passport.authenticate("login", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Credentials invalid" });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.cookie("currentUser", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600000,
      secure: env.NODE_ENV === "production",
    });

    res.status(200).json({ status: "success", message: "Login correcto" });
  })(req, res, next);
}

export function current(req, res) {
  const { id, email, role } = req.user;
  res.status(200).json({ status: "success", payload: { id, email, role } });
}

export function logout(req, res) {
  res.clearCookie("currentUser");
  res.status(200).json({ status: "success", message: "Logout exitoso" });
}
