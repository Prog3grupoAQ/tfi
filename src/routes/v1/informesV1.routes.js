import { Router } from "express";
import { InformesController } from "../../controllers/informes.controller.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";

export const InformesRoutes = Router();

const informesController = new InformesController();

InformesRoutes.get(
  "/total_os_anterior",
  informesController.generarInformeObrasSociales
);

InformesRoutes.get(
  "/total_es_anterior",
  informesController.generarInformeEspecialidades
);
