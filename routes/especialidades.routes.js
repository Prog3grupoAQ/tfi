import { Router } from "express";
import { buscarEspecialidad, crearEspecialidad, editarEspecialidad, listarEspecialidades } from "../controllers/especialidades.controller.js";

export const especialidadesRoutes = Router();

//TODO: mejorar los mensajes de error

//TODO: id sea numerico, field validatos params
especialidadesRoutes.get('/:id',[], buscarEspecialidad )

especialidadesRoutes.get('/', listarEspecialidades )

//TODO: validar nombre, activo
especialidadesRoutes.post('/', crearEspecialidad )

//TODO: validar nombre, activo, id numerico
especialidadesRoutes.put('/:id', editarEspecialidad)
