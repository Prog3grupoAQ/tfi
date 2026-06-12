import { Router } from "express";
import { check, param, query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { MedicosController } from "../../controllers/medicos.controller.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";

export const MedicosRoutes = Router();

const medicosController = new MedicosController();

/**
 * @swagger
 * tags:
 *   name: Médicos
 *   description: Gestión de médicos y sus obras sociales
 */

/**
 * @swagger
 * /medicos:
 *   get:
 *     summary: Listar todos los médicos
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: especialidad
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de especialidad
 *     responses:
 *       200:
 *         description: Lista de médicos
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
 *                     $ref: '#/components/schemas/Medico'
 *       401:
 *         description: No autenticado
 */
MedicosRoutes.get("/",
  autorizarUsuarios([1, 2, 3]),
  [
    query('especialidad').optional().isNumeric().withMessage('El id de especialidad debe ser numérico'),
    validarCampos
  ],
  medicosController.listarTodos
);

/**
 * @swagger
 * /medicos/{id}:
 *   get:
 *     summary: Obtener un médico por ID
 *     tags: [Médicos]
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
 *         description: Médico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Medico'
 *       404:
 *         description: Médico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Actualizar datos del médico
 *     tags: [Médicos]
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
 *             required: [id_especialidad, valor_consulta]
 *             properties:
 *               id_especialidad:
 *                 type: integer
 *                 example: 1
 *               valor_consulta:
 *                 type: number
 *                 format: float
 *                 example: 5000.00
 *               descripcion:
 *                 type: string
 *                 example: "Especialista en cardiología"
 *     responses:
 *       200:
 *         description: Médico actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Medico'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Médico no encontrado
 *   delete:
 *     summary: Eliminar un médico (soft delete)
 *     tags: [Médicos]
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
 *         description: Médico eliminado
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
 *                   example: "Médico eliminado correctamente"
 *       403:
 *         description: Sin permisos (requiere rol admin)
 *       404:
 *         description: Médico no encontrado
 */
MedicosRoutes.get("/:id",
  autorizarUsuarios([1, 2, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  medicosController.buscarPorId
);


// swagger documentado en el bloque /medicos/{id} de arriba
MedicosRoutes.put("/:id",
  autorizarUsuarios([1, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    check('id_especialidad').notEmpty().withMessage('El id de especialidad es obligatorio').isNumeric().withMessage('El id de especialidad debe ser numérico'),
    check('descripcion').optional().isString().withMessage('La descripción debe ser un texto'),
    check('valor_consulta').notEmpty().withMessage('El valor de consulta es obligatorio').isDecimal().withMessage('El valor de consulta debe ser un número decimal'),
    validarCampos
  ],
  medicosController.editar
);


// swagger documentado en el bloque /medicos/{id} de arriba
MedicosRoutes.delete("/:id",
  autorizarUsuarios([3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  medicosController.eliminar
);

/**
 * @swagger
 * /medicos/{id_medico}/obras-sociales:
 *   post:
 *     summary: Asociar obras sociales a un médico
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_medico
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [obras_sociales]
 *             properties:
 *               obras_sociales:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 1
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Obras sociales asociadas correctamente
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
 *                   example: "Obras sociales asociadas correctamente"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos (requiere rol admin)
 *       404:
 *         description: Médico no encontrado
 */
MedicosRoutes.post("/:id_medico/obras-sociales",
  autorizarUsuarios([3]),
  [
    param('id_medico').isInt().withMessage('id_medico debe ser un entero'),
    check('obras_sociales').isArray({ min: 1 }).withMessage('obras_sociales debe ser un array no vacío'),
    check('obras_sociales.*').isInt().withMessage('Cada elemento de obras_sociales debe ser un entero'),
    validarCampos
  ],
  medicosController.asociarObrasSociales
);