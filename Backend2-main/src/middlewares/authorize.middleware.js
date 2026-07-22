export function authorize(...allowedRoles) {
  return (req, res, next) =>{
    if (!req.user) {
      return res
      .status(401)
      .json({ status: "error", message: "No estás autenticado" });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res
    .status(403)
    .json({ status: "error", message: "No tenés permisos para acceder a este recurso"

     });

    }

    next();

  };
}
