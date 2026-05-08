import { Router } from "express";
import { param, check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js"
import { EspecialidadesController } from "../../controllers/especialidades.controller.js";
//import { buscarEspecialidad, crearEspecialidad, editarEspecialidad, listarEspecialidades, eliminarEspecialidad, restaurarEspecialidad, } from "../controllers/especialidades.controller.js";

export const EspecialidadesRoutes = Router();

const especialidadesController = new EspecialidadesController();


EspecialidadesRoutes.get("/", especialidadesController.listarTodas)

EspecialidadesRoutes.get('/:id', 
  [
    param('id').isNumeric().withMessage('El id debe ser numerico'), 
    validarCampos
  ], 
  especialidadesController.buscar
);
EspecialidadesRoutes.post('/', 
  [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'), 
    check('activo').notEmpty().withMessage('El campo activo es obligatorio').isBoolean().withMessage('El campo activo debe ser true o false'), 
    validarCampos
  ], 
  especialidadesController.crear
);

EspecialidadesRoutes.put('/:id',
[
    param('id').isNumeric().withMessage('El id debe ser numerico'), 
    check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto'), 
    check('activo').optional().isBoolean().withMessage('El campo activo debe ser true o false'), 
    validarCampos
  ], 
  especialidadesController.editar
);

EspecialidadesRoutes.delete("/:id", 
  [
    param('id').isNumeric().withMessage('El id debe ser numerico'),
    validarCampos
  ],
  especialidadesController.eliminar
);

EspecialidadesRoutes.patch("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numerico'), 
    validarCampos
  ],
  especialidadesController.restaurar
);

/*
especialidadesRoutes.get

especialidadesRoutes.post

especialidadesRoutes.put

especialidadesRoutes.delete

especialidadesRoutes.patch
*/