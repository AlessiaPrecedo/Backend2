import { UserRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/utils.js";

const userRepo = new UserRepository();

export class registerUser {
  async createUser(userData) {
    const exist = await userRepo.findByEmail(userData.email);
    userData.password = await createHash(userData.password);
    if (exist) {
      throw new Error("User already exists.");
    }

    const Nu = await userRepo.create(userData);
    return Nu;
  }
}
