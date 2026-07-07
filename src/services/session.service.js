import { UserRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { generateToken } from "../utils/jwt.js";
import { HttpError } from "../utils/errors.js";

const userRepo = new UserRepository();

export class SessionService {
  async register(userData) {
    if (
      !userData.first_name ||
      !userData.last_name ||
      !userData.email ||
      !userData.password
    ) {
      throw new HttpError(400, "All fields are required");
    }
    userData.email = userData.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userData.email)) {
      throw new HttpError(400, "Invalid email format");
    }

    if (userData.password.length < 8) {
      throw new HttpError(400, "Password must be at least 8 characters long");
    }

    const exist = await userRepo.findByEmail(userData.email);

    if (exist) {
      throw new HttpError(400, "User already exists");
    }

    userData.role = "user"; // impedir manipulación del rol

    userData.password = await createHash(userData.password);

    const newUser = await userRepo.create(userData);

    const { password, ...userWithoutPassword } = newUser.toObject();

    return userWithoutPassword;
  }

  async login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await userRepo.findByEmail(normalizedEmail);

    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const valid = await isValidPassword(password, user.password);

    if (!valid) {
      throw new HttpError(401, "Invalid Credentials");
    }
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return token;
  }
}
