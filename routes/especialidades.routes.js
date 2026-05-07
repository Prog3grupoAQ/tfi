import { Router } from "express";
import { param, check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import { buscarEspecialidad, crearEspecialidad, editarEspecialidad, listarEspecialidades } from "../controllers/especialidades.controller.js";

export const especialidadesRoutes = Router();

//TODO: mejorar los mensajes de error

//TODO: id sea numerico, field validatos params
especialidadesRoutes.get('/:id', [param('id').isNumeric().withMessage('El id debe ser numerico'), validarCampos], buscarEspecialidad)

especialidadesRoutes.get('/', listarEspecialidades )

//TODO: validar nombre, activo
especialidadesRoutes.post('/', [check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'), check('activo').notEmpty().withMessage('El campo activo es obligatorio').isBoolean().withMessage('El campo activo debe ser true o false'), validarCampos], crearEspecialidad )

//TODO: validar nombre, activo, id numerico
especialidadesRoutes.put('/:id', [param('id').isNumeric().withMessage('El id debe ser numerico'), check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto'), check('activo').notEmpty().withMessage('El campo activo es obligatorio').isBoolean().withMessage('El campo activo debe ser true o false'), validarCampos], editarEspecialidad)
