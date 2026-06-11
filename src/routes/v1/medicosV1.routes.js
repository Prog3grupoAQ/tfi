import { Router } from "express";
import { check, param, query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { MedicosController } from "../../controllers/medicos.controller.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";

export const MedicosRoutes = Router();

const medicosController = new MedicosController();

MedicosRoutes.get("/",
  autorizarUsuarios([1, 2, 3]),
  [
    query('especialidad').optional().isNumeric().withMessage('El id de especialidad debe ser numérico'),
    validarCampos
  ],
  medicosController.listarTodos
);

MedicosRoutes.get("/:id",
  autorizarUsuarios([1, 2, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  medicosController.buscarPorId
);


MedicosRoutes.put("/:id",
  autorizarUsuarios([1, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    check('id_especialidad').notEmpty().withMessage('El id de especialidad es obligatorio').isNumeric().withMessage('El id de especialidad debe ser numérico'),
    check('descripcion').optional().isString().withMessage('La descripción debe ser un texto'),
    check('valor_consulta').notEmpty().withMessage('El valor de consulta es obligatorio').isDecimal().withMessage('El valor de consulta debe ser un número decimal'),
    validarCampos
  ],
  medicosController.editar
);


MedicosRoutes.delete("/:id",
  autorizarUsuarios([3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  medicosController.eliminar
);

MedicosRoutes.post("/:id_medico/obras-sociales",
  autorizarUsuarios([3]),
  [
    param('id_medico').isInt().withMessage('id_medico debe ser un entero'),
    check('obras_sociales').isArray({ min: 1 }).withMessage('obras_sociales debe ser un array no vacío'),
    check('obras_sociales.*').isInt().withMessage('Cada elemento de obras_sociales debe ser un entero'),
    validarCampos
  ],
  medicosController.asociarObrasSociales
);