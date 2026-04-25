import { Router } from "express";
import { activarEspecialidad, buscarEspecialidad, crearEspecialidad, desactivarEspecialidad, listarEspecialidades } from "../controllers/especialidades.controller.js";

export const especialidadesRoutes = Router();

//TODO: mejorar los mensajes de error

especialidadesRoutes.get('/:id', buscarEspecialidad )

especialidadesRoutes.get('/', listarEspecialidades )

especialidadesRoutes.post('/crear', crearEspecialidad )

especialidadesRoutes.post('/:id/activar', activarEspecialidad )

especialidadesRoutes.post('/:id/desactivar', desactivarEspecialidad )