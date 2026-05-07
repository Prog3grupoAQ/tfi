export const validarEspecialidad = (req, res, next) => {
  const { nombre, activo } = req.body;

  if (!nombre) {
    return res.status(400).json({
      ok: false,
      msg: "Nombre requerido",
    });
  }

  if (typeof nombre !== "string") {
    return res.status(400).json({
      ok: false,
      msg: "Nombre invalido",
    });
  }

  if (activo !== undefined && activo !== 0 && activo !== 1) {
    return res.status(400).json({
      ok: false,
      msg: "Activo debe ser 0 o 1",
    });
  }

  next();
};

export const validarId = (req, res, next) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      ok: false,
      msg: "ID invalido",
    });
  }

  next();
};
