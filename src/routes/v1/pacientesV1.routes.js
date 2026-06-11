import { Router } from "express";
import { check, param, query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { PacientesController } from "../../controllers/pacientes.controller.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";

export const PacientesRoutes = Router();

const pacientesController = new PacientesController();

PacientesRoutes.get("/",
  autorizarUsuarios([1, 3]),
  [
    query('obra_social').optional().isNumeric().withMessage('El id de obra social debe ser numérico'),
    validarCampos
  ],
  pacientesController.listarTodos
);

PacientesRoutes.get("/:id",
  autorizarUsuarios([1, 2, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  pacientesController.buscarPorId
);


PacientesRoutes.put("/:id",
  autorizarUsuarios([2, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    check('id_obra_social').notEmpty().withMessage('El id de obra social es obligatorio').isNumeric().withMessage('El id de obra social debe ser numérico'),
    validarCampos
  ],
  pacientesController.editar
);

PacientesRoutes.delete("/:id",
  autorizarUsuarios([3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  pacientesController.eliminar
);
