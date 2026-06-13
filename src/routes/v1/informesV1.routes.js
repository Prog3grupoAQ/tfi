import { Router } from "express";
import { query } from "express-validator";
import { InformesController } from "../../controllers/informes.controller.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";
import { validarCampos } from "../../middlewares/validarCampos.js";

export const InformesRoutes = Router();

const informesController = new InformesController();

/**
 * @swagger
 * tags:
 *   name: Informes
 *   description: Generación de reportes en PDF (requiere rol admin)
 */

/**
 * @swagger
 * /informes/total_os_anterior:
 *   get:
 *     summary: Informe de totales por obra social del mes anterior
 *     tags: [Informes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte en PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Sin permisos (requiere rol admin)
 */
InformesRoutes.get(
  "/total_os_anterior",
  autorizarUsuarios([3]),
  informesController.generarInformeObrasSociales
);

/**
 * @swagger
 * /informes/total_es_anterior:
 *   get:
 *     summary: Informe de totales por especialidad del mes anterior
 *     tags: [Informes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte en PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Sin permisos (requiere rol admin)
 */
InformesRoutes.get(
  "/total_es_anterior",
  autorizarUsuarios([3]),
  informesController.generarInformeEspecialidades
);

/**
 * @swagger
 * /informes/turnos_completados:
 *   get:
 *     summary: Informe de turnos completados por mes y año
 *     tags: [Informes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mes
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 6
 *       - in: query
 *         name: anio
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 2000
 *           maximum: 2100
 *         example: 2026
 *     responses:
 *       200:
 *         description: Reporte en PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos (requiere rol admin)
 */
InformesRoutes.get(
  "/turnos_completados",
  autorizarUsuarios([3]),
  query("mes").isInt({ min: 1, max: 12 }).withMessage("El mes debe ser un número entre 1 y 12"),
  query("anio").isInt({ min: 2000, max: 2100 }).withMessage("El año debe ser un número válido"),
  validarCampos,
  informesController.generarInformeTurnosCompletados
);

/**
 * @swagger
 * /informes/turnos_medico:
 *   get:
 *     summary: Informe de turnos de un médico por mes y año
 *     tags: [Informes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_medico
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *       - in: query
 *         name: mes
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 6
 *       - in: query
 *         name: anio
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 2000
 *           maximum: 2100
 *         example: 2026
 *     responses:
 *       200:
 *         description: Reporte en PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos (requiere rol admin)
 */
InformesRoutes.get(
  "/turnos_medico",
  autorizarUsuarios([3]),
  query("id_medico").isInt({ min: 1 }).withMessage("El id_medico debe ser un número válido"),
  query("mes").isInt({ min: 1, max: 12 }).withMessage("El mes debe ser un número entre 1 y 12"),
  query("anio").isInt({ min: 2000, max: 2100 }).withMessage("El año debe ser un número válido"),
  validarCampos,
  informesController.generarInformeTurnosMedico
);
