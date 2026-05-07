import { Router } from "express";

import {
  buscarEspecialidad,
  crearEspecialidad,
  editarEspecialidad,
  listarEspecialidades,
  eliminarEspecialidad,
  restaurarEspecialidad,
} from "../controllers/especialidades.controller.js";

import {
  validarEspecialidad,
  validarId,
} from "../middlewares/especialidades.middleware.js";

export const especialidadesRoutes = Router();

// BROWSE
// GET [url]/api/v1/especialidades
especialidadesRoutes.get("/", listarEspecialidades);

// READ
// GET [url]/api/v1/especialidades/:id
especialidadesRoutes.get("/:id", [validarId], buscarEspecialidad);

// ADD
// POST [url]/api/v1/especialidades
especialidadesRoutes.post("/", [validarEspecialidad], crearEspecialidad);

// EDIT
// PUT [url]/api/v1/especialidades/:id
especialidadesRoutes.put(
  "/:id",
  [validarId, validarEspecialidad],
  editarEspecialidad,
);

// DELETE (soft delete)
// DELETE [url]/api/v1/especialidades/:id
especialidadesRoutes.delete("/:id", [validarId], eliminarEspecialidad);

// RESTORE (Extra)
// PATCH [url]/api/v1/especialidades/:id/restaurar
especialidadesRoutes.patch(
  "/:id/restaurar",
  [validarId],
  restaurarEspecialidad,
);
