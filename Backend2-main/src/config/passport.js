import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import { UserRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { HttpError } from "../utils/errors.js";
import { env } from "./env.js";

const userRepo = new UserRepository();

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies.currentUser || null;
  }
  return null;
};

export function initializePassport() {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name } = req.body;
          if (!first_name || !last_name || !email || !password) {
            return done(new HttpError(400, "All fields are required"));
          }

          const normalizedEmail = email.trim().toLowerCase();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!emailRegex.test(normalizedEmail)) {
            return done(new HttpError(400, "Invalid email format"));
          }
          if (password.length < 8) {
            return done(
              new HttpError(400, "Password must be at least 8 characters long"),
            );
          }
          const exists = await userRepo.findByEmail(normalizedEmail);
          if (exists) {
            return done(new HttpError(400, "User already exists"));
          }

          const hashedPassword = await createHash(password);

          const newUser = await userRepo.create({
            first_name,
            last_name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "user",
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const normalizedEmail = email.trim().toLowerCase();
          const user = await userRepo.findByEmail(normalizedEmail);

          if (!user) {
            return done(null, false);
          }

          const valid = await isValidPassword(password, user.password);
          if (!valid) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: env.JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}

export default initializePassport;
