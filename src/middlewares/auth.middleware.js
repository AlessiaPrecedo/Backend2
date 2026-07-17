import passport from "passport";

export function auth(req, res, next) {
  passport.authenticate("current", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const isTokenError =
        info?.name === "TokenExpiredError" ||
        info?.name === "JsonWebTokenError";

      return res.status(401).json({
        status: "error",
        message: isTokenError ? "Token inválido o expirado" : "No autenticado",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
}
