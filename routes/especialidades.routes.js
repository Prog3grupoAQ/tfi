import { Router } from "express";
import { activarEspecialidad, buscarEspecialidad, crearEspecialidad, desactivarEspecialidad, listarEspecialidades } from "../controllers/especialidades.controller.js";

export const especialidadesRoutes = Router();

//TODO: mejorar los mensajes de error

//TODO: id sea numerico, field validatos params
especialidadesRoutes.get('/:id',[], buscarEspecialidad )

especialidadesRoutes.get('/', listarEspecialidades )

//TODO: validar nombre, activo
especialidadesRoutes.post('/crear', crearEspecialidad )

//TODO: id sea numerico, field validatos params
especialidadesRoutes.post('/:id/activar', activarEspecialidad )

//TODO: id sea numerico, field validatos params
especialidadesRoutes.post('/:id/desactivar', desactivarEspecialidad )

//TODO: editar especialidad, y validar
