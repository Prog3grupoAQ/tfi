import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { uploadSingle } from "../../middlewares/upload.js";
import { RegistroController } from "../../controllers/registro.controller.js";

export const RegistroRoutes = Router();

const registroController = new RegistroController();

RegistroRoutes.post("/medico",
  uploadSingle('foto'),
  [
    check('documento').notEmpty().withMessage('El documento es obligatorio'),
    check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    check('nombres').notEmpty().withMessage('Los nombres son obligatorios'),
    check('email').notEmpty().isEmail().withMessage('El email no es válido'),
    check('contrasenia').notEmpty().withMessage('La contraseña es obligatoria'),
    check('id_especialidad').notEmpty().isNumeric().withMessage('El id de especialidad debe ser numérico'),
    check('matricula').notEmpty().isNumeric().withMessage('La matrícula debe ser numérica'),
    check('descripcion').optional().isString(),
    check('valor_consulta').notEmpty().isDecimal().withMessage('El valor de consulta debe ser un número decimal'),
    validarCampos
  ],
  registroController.registrarMedico
);

RegistroRoutes.post("/paciente",
  uploadSingle('foto'),
  [
    check('documento').notEmpty().withMessage('El documento es obligatorio'),
    check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    check('nombres').notEmpty().withMessage('Los nombres son obligatorios'),
    check('email').notEmpty().isEmail().withMessage('El email no es válido'),
    check('contrasenia').notEmpty().withMessage('La contraseña es obligatoria'),
    check('id_obra_social').notEmpty().isNumeric().withMessage('El id de obra social debe ser numérico'),
    validarCampos
  ],
  registroController.registrarPaciente
);
