import { UserRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/utils.js";

const userRepository = new UserRepository();

export class UserService {
  async getAllUsers() {
    const users = await userRepository.findAll();
    return users;
  }
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  async createUser(userData) {
    // Business logic: check if email already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("A user with that email already exists.");
    }
    userData.email = userData.email.trim().toLowerCase();

    userData.password = await createHash(userData.password);

    const newUser = await userRepository.create(userData);
    return newUser;
  }

  async updateUser(id, userData) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = await userRepository.update(id, userData);
    return updatedUser;
  }

  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await userRepository.delete(id);
    return { message: "User successfully deleted" };
  }
}

//logica de negocio de usuarios
