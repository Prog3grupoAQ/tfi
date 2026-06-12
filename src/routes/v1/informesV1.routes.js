import { Router } from "express";
import { query } from "express-validator";
import { InformesController } from "../../controllers/informes.controller.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";
import { validarCampos } from "../../middlewares/validarCampos.js";

export const InformesRoutes = Router();

const informesController = new InformesController();

InformesRoutes.get(
  "/total_os_anterior",
  autorizarUsuarios([3]),
  informesController.generarInformeObrasSociales
);

InformesRoutes.get(
  "/total_es_anterior",
  autorizarUsuarios([3]),
  informesController.generarInformeEspecialidades
);

InformesRoutes.get(
  "/turnos_completados",
  autorizarUsuarios([3]),
  query("mes").isInt({ min: 1, max: 12 }).withMessage("El mes debe ser un número entre 1 y 12"),
  query("anio").isInt({ min: 2000, max: 2100 }).withMessage("El año debe ser un número válido"),
  validarCampos,
  informesController.generarInformeTurnosCompletados
);

InformesRoutes.get(
  "/turnos_medico",
  autorizarUsuarios([3]),
  query("id_medico").isInt({ min: 1 }).withMessage("El id_medico debe ser un número válido"),
  query("mes").isInt({ min: 1, max: 12 }).withMessage("El mes debe ser un número entre 1 y 12"),
  query("anio").isInt({ min: 2000, max: 2100 }).withMessage("El año debe ser un número válido"),
  validarCampos,
  informesController.generarInformeTurnosMedico
);
