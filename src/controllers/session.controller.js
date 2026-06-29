/**
 * @param {import ("express").Request} req
 * @param {import ("express").Request}res
 * @param {*} next
 */

import { UserService } from "../services/user.service.js";

export async function register(req, res, next) {
  try {
    const { first_name, last_name, email, password } = req.body;
    const hashedPassword = await createHash(password);
    const newUser = await UserModel.create({ email, password: hashedPassword });
    res.status(201).json({ newUser });
  } catch (error) {
    if (error.code == 11000) {
      res.status(409).json({ error: "el usuario ya existe" });
    } else {
      res.status(406).json({ error: error.erros.email.message });
    }
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (isValidPassword(password, user.password)) {
      const sessionData = {
        email: user.email,
        role: user.role,
      };
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Credentials invalid" });
    }
  } catch (error) {
    res.status(401).json({ message: "" });
  }
}
// controlador de sessiones a desarrollar
