export const autorizarUsuarios = (roles = []) => {
  return (req, res, next) => {
    const usuario = req.user;

    if (!usuario || !roles.includes(usuario.rol)) {
      return res.status(403).json({
        estado: false,
        mensaje: "Acceso denegado",
      });
    }

    next();
  };
};
