import { Router } from "express";
import { param, check, query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { MedicosController } from "../../controllers/medicos.controller.js";

export const MedicosRoutes = Router();

const medicosController = new MedicosController();

MedicosRoutes.get("/",
  [
    query('especialidad').optional().isNumeric().withMessage('El id de especialidad debe ser numérico'),
    validarCampos
  ],
  medicosController.listarTodos
);

MedicosRoutes.get("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  medicosController.buscarPorId
);

MedicosRoutes.post("/",
  [
    check('id_usuario').notEmpty().withMessage('El id de usuario es obligatorio').isNumeric().withMessage('El id de usuario debe ser numérico'),
    check('id_especialidad').notEmpty().withMessage('El id de especialidad es obligatorio').isNumeric().withMessage('El id de especialidad debe ser numérico'),
    check('matricula').notEmpty().withMessage('La matrícula es obligatoria').isNumeric().withMessage('La matrícula debe ser numérica'),
    check('descripcion').optional().isString().withMessage('La descripción debe ser un texto'),
    check('valor_consulta').notEmpty().withMessage('El valor de consulta es obligatorio').isDecimal().withMessage('El valor de consulta debe ser un número decimal'),
    validarCampos
  ],
  medicosController.crear
);

MedicosRoutes.put("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    check('id_especialidad').notEmpty().withMessage('El id de especialidad es obligatorio').isNumeric().withMessage('El id de especialidad debe ser numérico'),
    check('descripcion').optional().isString().withMessage('La descripción debe ser un texto'),
    check('valor_consulta').notEmpty().withMessage('El valor de consulta es obligatorio').isDecimal().withMessage('El valor de consulta debe ser un número decimal'),
    validarCampos
  ],
  medicosController.editar
);
