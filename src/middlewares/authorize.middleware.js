export function authorize(...allowedRoles) {
  return (req, res, next) => {
    // Si esto llega a disparar, "auth" no corrió antes en la ruta.
    if (!req.user) {
      return res
        .status(401)
        .json({ status: "error", message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
      .status(403)
      .json({
        status: "error",
        message: "You don't have permission to perform this action",
      });
    }

    next();
  };
}
