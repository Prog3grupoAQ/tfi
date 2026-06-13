import { Router } from "express";
import { param, check, query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { TurnosReservasController } from "../../controllers/turnos_reservas.controller.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";

export const TurnosRoutes = Router();

const turnosController = new TurnosReservasController();

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Gestión de turnos médicos
 */

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Listar turnos
 *     description: >
 *       Roles 1 (médico) y 2 (paciente) reciben únicamente sus propios turnos,
 *       ignorando los query params de filtrado. El rol 3 (admin) puede filtrar por médico o paciente.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: medico
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de médico (solo admin)
 *       - in: query
 *         name: paciente
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de paciente (solo admin)
 *     responses:
 *       200:
 *         description: Lista de turnos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Turno'
 *       401:
 *         description: No autenticado
 *   post:
 *     summary: Crear un nuevo turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_medico, id_paciente, id_obra_social, fecha_hora]
 *             properties:
 *               id_medico:
 *                 type: integer
 *                 example: 1
 *               id_paciente:
 *                 type: integer
 *                 example: 1
 *               id_obra_social:
 *                 type: integer
 *                 example: 1
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-04-01T17:00:00"
 *     responses:
 *       201:
 *         description: Turno creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos
 */
TurnosRoutes.get("/",
  autorizarUsuarios([1, 2, 3]),
  [
    query('medico').optional().isNumeric().withMessage('El id de médico debe ser numérico'),
    query('paciente').optional().isNumeric().withMessage('El id de paciente debe ser numérico'),
    validarCampos
  ],
  turnosController.listarTodos
);

/**
 * @swagger
 * /turnos/{id}:
 *   get:
 *     summary: Obtener un turno por ID
 *     description: Roles 1 y 2 solo pueden ver sus propios turnos.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Turno'
 *       404:
 *         description: Turno no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Cancelar un turno (soft delete)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno cancelado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Turno cancelado correctamente"
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Turno no encontrado
 */
TurnosRoutes.get("/:id",
  autorizarUsuarios([1, 2, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  turnosController.buscarPorId
);

// swagger documentado en el bloque /turnos de arriba
TurnosRoutes.post("/",
  autorizarUsuarios([2, 3]),
  [
    check('id_medico').notEmpty().withMessage('El id de médico es obligatorio').isNumeric().withMessage('El id de médico debe ser numérico'),
    check('id_paciente').notEmpty().withMessage('El id de paciente es obligatorio').isNumeric().withMessage('El id de paciente debe ser numérico'),
    check('id_obra_social').notEmpty().withMessage('El id de obra social es obligatorio').isNumeric().withMessage('El id de obra social debe ser numérico'),
    check('fecha_hora').notEmpty().withMessage('La fecha y hora son obligatorias').isISO8601().withMessage('La fecha debe tener formato válido (ej: 2026-04-01T17:00:00)'),
    validarCampos
  ],
  turnosController.crear
);

/**
 * @swagger
 * /turnos/{id}/atender:
 *   patch:
 *     summary: Marcar un turno como atendido
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno marcado como atendido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Turno marcado como atendido"
 *       403:
 *         description: Sin permisos (requiere rol médico o admin)
 *       404:
 *         description: Turno no encontrado
 */
TurnosRoutes.patch("/:id/atender",
  autorizarUsuarios([1, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  turnosController.marcarAtendido
);

// swagger documentado en el bloque /turnos/{id} de arriba
TurnosRoutes.delete("/:id",
  autorizarUsuarios([1, 2, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  turnosController.eliminar
);

/**
 * @swagger
 * /turnos/{id}/restaurar:
 *   patch:
 *     summary: Restaurar un turno cancelado
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno restaurado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Turno restaurado correctamente"
 *       403:
 *         description: Sin permisos (requiere rol admin)
 *       404:
 *         description: Turno no encontrado
 */
TurnosRoutes.patch("/:id/restaurar",
  autorizarUsuarios([3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  turnosController.restaurar
);
