import { UserRepository } from "../repositories/user.repository.js";

const userRepository = new UserRepository();

export class UserService {
  async getAllUsers() {
    const users = await userRepository.findAll();
    return users;
  }
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  }
  async createUser(userData) {
    // Business logic: check if email already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Ya existe un usuario con ese email");
    }
    const newUser = await userRepository.create(userData);
    return newUser;
  }

  async updateUser(id, userData) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const updatedUser = await userRepository.update(id, userData);
    return updatedUser;
  }

  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    await userRepository.delete(id);
    return { message: "Usuario eliminado correctamente" };
  }
}

//logica de negocio de usuarios
