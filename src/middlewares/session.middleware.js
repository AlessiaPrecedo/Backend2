import { UserModel } from "../models/user.model.js";

export async function userExists(req, res, next) {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (user == null)
    return res.status(401).json({ error: "el usuario no existe" });
  req.user = user;
  next();
}
