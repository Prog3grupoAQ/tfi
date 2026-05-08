import { Router } from "express";
import { param, check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import { buscarEspecialidad, crearEspecialidad, editarEspecialidad, listarEspecialidades, eliminarEspecialidad, restaurarEspecialidad, } from "../controllers/especialidades.controller.js";


import {
  validarEspecialidad,
  validarId,
} from "../middlewares/especialidades.middleware.js";

export const especialidadesRoutes = Router();


especialidadesRoutes.get("/", listarEspecialidades);

especialidadesRoutes.get('/:id', 
  [
    param('id').isNumeric().withMessage('El id debe ser numerico'), 
    validarCampos
  ], 
  buscarEspecialidad
);

especialidadesRoutes.post('/', 
  [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'), 
    check('activo').notEmpty().withMessage('El campo activo es obligatorio').isBoolean().withMessage('El campo activo debe ser true o false'), 
    validarCampos
  ], 
  crearEspecialidad 
);

especialidadesRoutes.put('/:id', 
  [
    param('id').isNumeric().withMessage('El id debe ser numerico'), 
    check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto'), 
    check('activo').notEmpty().withMessage('El campo activo es obligatorio').isBoolean().withMessage('El campo activo debe ser true o false'), 
    validarCampos
  ], 
  editarEspecialidad
);

especialidadesRoutes.delete("/:id", 
  [
    param('id').isNumeric().withMessage('El id debe ser numerico'), 
    validarCampos
  ], 
  eliminarEspecialidad
);

especialidadesRoutes.patch("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numerico'), 
    validarCampos
  ],
  restaurarEspecialidad,
);
