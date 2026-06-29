import bcrypt from "bcrypt";

export async function createHash(password) {
  return await bcrypt.hash(password, await bcrypt.genSalt(10));
}

export async function isValidPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
