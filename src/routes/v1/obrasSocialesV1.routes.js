import { Router } from "express";
import { param, check, query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { ObrasSocialesController } from "../../controllers/obras_sociales.controller.js";

export const ObrasSocialesRoutes = Router();

const obrasSocialesController = new ObrasSocialesController();

ObrasSocialesRoutes.get("/",
  [
    query('inactivos').optional().isBoolean().withMessage('El parámetro inactivos debe ser true o false'),
    validarCampos
  ],
  obrasSocialesController.listarTodas
);

ObrasSocialesRoutes.get("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  obrasSocialesController.buscarPorId
);

ObrasSocialesRoutes.post("/",
  [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto').isLength({ min: 3, max: 120 }).withMessage('El nombre debe tener entre 3 y 120 caracteres'),
    check('descripcion').notEmpty().withMessage('La descripción es obligatoria').isString().withMessage('La descripción debe ser un texto').isLength({ max: 255 }).withMessage('La descripción no puede superar los 255 caracteres'),
    check('porcentaje_descuento').optional().isFloat({ min: 0, max: 1 }).withMessage('El porcentaje de descuento debe ser un número entre 0 y 1 (ej: 0.20 para 20%)'),
    check('es_particular').optional().isBoolean().withMessage('El campo es_particular debe ser true o false'),
    validarCampos
  ],
  obrasSocialesController.crear
);

ObrasSocialesRoutes.put("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto').isLength({ min: 3, max: 120 }).withMessage('El nombre debe tener entre 3 y 120 caracteres'),
    check('descripcion').notEmpty().withMessage('La descripción es obligatoria').isString().withMessage('La descripción debe ser un texto').isLength({ max: 255 }).withMessage('La descripción no puede superar los 255 caracteres'),
    check('porcentaje_descuento').optional().isFloat({ min: 0, max: 1 }).withMessage('El porcentaje de descuento debe ser un número entre 0 y 1 (ej: 0.20 para 20%)'),
    check('es_particular').optional().isBoolean().withMessage('El campo es_particular debe ser true o false'),
    validarCampos
  ],
  obrasSocialesController.editar
);

ObrasSocialesRoutes.delete("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  obrasSocialesController.eliminar
);

ObrasSocialesRoutes.patch("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  obrasSocialesController.restaurar
);
