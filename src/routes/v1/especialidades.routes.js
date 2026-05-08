import { Router } from "express";
import { param, check, query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js"
import { EspecialidadesController } from "../../controllers/especialidades.controller.js";


export const EspecialidadesRoutes = Router();

const especialidadesController = new EspecialidadesController();


EspecialidadesRoutes.get("/",
  [
    query('inactivos').optional().isBoolean().withMessage('El parámetro inactivos debe ser true o false'),
    validarCampos
  ],
  especialidadesController.listarTodas
);

EspecialidadesRoutes.get('/:id', 
  [
    param('id').isNumeric().withMessage('El id debe ser numerico'), 
    validarCampos
  ], 
  especialidadesController.buscar
);
EspecialidadesRoutes.post('/',
  [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto').isLength({ min: 3, max: 120 }).withMessage('El nombre debe tener entre 3 y 120 caracteres'),
    check('activo').optional().isBoolean().withMessage('El campo activo debe ser true o false'),
    validarCampos
  ],
  especialidadesController.crear
);

EspecialidadesRoutes.put('/:id',
[
    param('id').isNumeric().withMessage('El id debe ser numerico'), 
    check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto').isLength({ min: 3, max: 120 }).withMessage('El nombre debe tener entre 3 y 120 caracteres'), 
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
