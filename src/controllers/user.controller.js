import { UserService } from "../services/user.service.js";

const userService = new UserService();

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ status: "success", data: users });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ status: "success", data: user });
  } catch (error) {
    const statusCode = error.message === "Usuario no encontrado" ? 404 : 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    const statusCode = error.message.includes("Ya existe") ? 400 : 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ status: "success", data: user });
  } catch (error) {
    const statusCode = error.message === "Usuario no encontrado" ? 404 : 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json({ status: "success", data: result });
  } catch (error) {
    const statusCode = error.message === "Usuario no encontrado" ? 404 : 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};
