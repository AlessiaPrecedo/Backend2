import { UserModel } from "../models/user.models.js";

export const getUsers = async (req, res) => {
  try {
    res.json({ message: "Listado de usuarios" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};
export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.json({ status: "success", data: user });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};
export const createUser = async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ status: "success", data: user });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    res.json({ status: "success", data: user });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
