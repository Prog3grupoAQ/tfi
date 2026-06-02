import { Router } from "express";
import { param, check, query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { PacientesController } from "../../controllers/pacientes.controller.js";

export const PacientesRoutes = Router();

const pacientesController = new PacientesController();

PacientesRoutes.get("/",
  [
    query('obra_social').optional().isNumeric().withMessage('El id de obra social debe ser numérico'),
    validarCampos
  ],
  pacientesController.listarTodos
);

PacientesRoutes.get("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  pacientesController.buscarPorId
);

PacientesRoutes.post("/",
  [
    check('id_usuario').notEmpty().withMessage('El id de usuario es obligatorio').isNumeric().withMessage('El id de usuario debe ser numérico'),
    check('id_obra_social').notEmpty().withMessage('El id de obra social es obligatorio').isNumeric().withMessage('El id de obra social debe ser numérico'),
    validarCampos
  ],
  pacientesController.crear
);

PacientesRoutes.put("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    check('id_obra_social').notEmpty().withMessage('El id de obra social es obligatorio').isNumeric().withMessage('El id de obra social debe ser numérico'),
    validarCampos
  ],
  pacientesController.editar
);

PacientesRoutes.delete("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  pacientesController.eliminar
);
