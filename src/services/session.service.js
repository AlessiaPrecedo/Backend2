import { UserRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/utils.js";

const userRepo = new UserRepository();

export class SessionService {
  async register(userData) {
    if (
      !userData.first_name ||
      !userData.last_name ||
      !userData.email ||
      !userData.password
    ) {
      throw new Error("All fields are required");
    }
    userData.email = userData.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userData.email)) {
      throw new Error("Invalid email format");
    }

    if (userData.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const exist = await userRepo.findByEmail(userData.email);

    if (exist) {
      throw new Error("User already exists");
    }

    userData.role = "user"; // impedir manipulación del rol

    userData.password = await createHash(userData.password);

    const newUser = await userRepo.create(userData);

    const { password, ...userWithoutPassword } = newUser.toObject();

    return userWithoutPassword;
  }

  async login(email, password) {
    const user = await userRepo.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const valid = await isValidPassword(password, user.password);

    if (!valid) {
      throw new Error("Invalid Credentials");
    }
    const { password: _, ...userWithoutPassword } = user.toObject();

    return userWithoutPassword;
  }
}
