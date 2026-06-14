import { Router } from "express";
import { query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { AuditoriaController } from "../../controllers/auditoria.controller.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";

export const AuditoriaRoutes = Router();

const auditoriaController = new AuditoriaController();

AuditoriaRoutes.get("/",
  autorizarUsuarios([3]),
  [
    query('email').optional().isString().withMessage('El email debe ser un texto'),
    query('id_usuario').optional().isNumeric().withMessage('El id de usuario debe ser numérico'),
    query('accion').optional().isString().withMessage('La acción debe ser un texto'),
    query('limite').optional().isInt({ min: 1 }).withMessage('El límite debe ser un entero positivo'),
    validarCampos
  ],
  auditoriaController.listarTodos
);
