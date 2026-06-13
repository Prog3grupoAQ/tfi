import { Router } from "express";
import { check, param, query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { PacientesController } from "../../controllers/pacientes.controller.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";

export const PacientesRoutes = Router();

const pacientesController = new PacientesController();

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: Gestión de pacientes
 */

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Listar todos los pacientes
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: obra_social
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de obra social
 *     responses:
 *       200:
 *         description: Lista de pacientes
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
 *                     $ref: '#/components/schemas/Paciente'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos (requiere rol médico o admin)
 */
PacientesRoutes.get("/",
  autorizarUsuarios([1, 3]),
  [
    query('obra_social').optional().isNumeric().withMessage('El id de obra social debe ser numérico'),
    validarCampos
  ],
  pacientesController.listarTodos
);

/**
 * @swagger
 * /pacientes/{id}:
 *   get:
 *     summary: Obtener un paciente por ID
 *     description: El rol 2 (paciente) solo puede ver su propio perfil.
 *     tags: [Pacientes]
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
 *         description: Paciente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Paciente'
 *       404:
 *         description: Paciente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Actualizar obra social del paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_obra_social]
 *             properties:
 *               id_obra_social:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Paciente actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Paciente'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Paciente no encontrado
 *   delete:
 *     summary: Eliminar un paciente (soft delete)
 *     tags: [Pacientes]
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
 *         description: Paciente eliminado
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
 *                   example: "Paciente eliminado correctamente"
 *       403:
 *         description: Sin permisos (requiere rol admin)
 *       404:
 *         description: Paciente no encontrado
 */
PacientesRoutes.get("/:id",
  autorizarUsuarios([1, 2, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  pacientesController.buscarPorId
);


// swagger documentado en el bloque /pacientes/{id} de arriba
PacientesRoutes.put("/:id",
  autorizarUsuarios([2, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    check('id_obra_social').notEmpty().withMessage('El id de obra social es obligatorio').isNumeric().withMessage('El id de obra social debe ser numérico'),
    validarCampos
  ],
  pacientesController.editar
);

// swagger documentado en el bloque /pacientes/{id} de arriba
PacientesRoutes.delete("/:id",
  autorizarUsuarios([3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  pacientesController.eliminar
);
