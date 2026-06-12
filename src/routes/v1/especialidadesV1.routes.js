import { Router } from "express";
import { param, check, query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js"
import { EspecialidadesController } from "../../controllers/especialidades.controller.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";

export const EspecialidadesRoutes = Router();

const especialidadesController = new EspecialidadesController();

/**
 * @swagger
 * tags:
 *   name: Especialidades
 *   description: Gestión de especialidades médicas
 */

/**
 * @swagger
 * /especialidades:
 *   get:
 *     summary: Listar todas las especialidades
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: inactivos
 *         schema:
 *           type: boolean
 *         description: Incluir especialidades inactivas
 *     responses:
 *       200:
 *         description: Lista de especialidades
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
 *                     $ref: '#/components/schemas/Especialidad'
 *       401:
 *         description: No autenticado
 *   post:
 *     summary: Crear una nueva especialidad
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 120
 *                 example: "Neurología"
 *     responses:
 *       201:
 *         description: Especialidad creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Especialidad'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos (requiere rol admin)
 */
EspecialidadesRoutes.get("/",
  autorizarUsuarios([1, 2, 3]),
  [
    query('inactivos').optional().isBoolean().withMessage('El parámetro inactivos debe ser true o false'),
    validarCampos
  ],
  especialidadesController.listarTodas
);

/**
 * @swagger
 * /especialidades/{id}:
 *   get:
 *     summary: Obtener una especialidad por ID
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la especialidad
 *     responses:
 *       200:
 *         description: Especialidad encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Especialidad'
 *       404:
 *         description: Especialidad no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Actualizar una especialidad
 *     tags: [Especialidades]
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
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 120
 *                 example: "Neurología"
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Especialidad actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Especialidad'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos (requiere rol admin)
 *       404:
 *         description: Especialidad no encontrada
 *   delete:
 *     summary: Eliminar una especialidad (soft delete)
 *     tags: [Especialidades]
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
 *         description: Especialidad eliminada
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
 *                   example: "Especialidad eliminada correctamente"
 *       403:
 *         description: Sin permisos (requiere rol admin)
 *       404:
 *         description: Especialidad no encontrada
 *   patch:
 *     summary: Restaurar una especialidad eliminada
 *     tags: [Especialidades]
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
 *         description: Especialidad restaurada
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
 *                   example: "Especialidad restaurada correctamente"
 *       403:
 *         description: Sin permisos (requiere rol admin)
 *       404:
 *         description: Especialidad no encontrada
 */
EspecialidadesRoutes.get('/:id',
  autorizarUsuarios([1, 2, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numerico'), 
    validarCampos
  ], 
  especialidadesController.buscarPorId
);

EspecialidadesRoutes.post('/',
  autorizarUsuarios([3]),
  [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto').isLength({ min: 3, max: 120 }).withMessage('El nombre debe tener entre 3 y 120 caracteres'),
    validarCampos
  ],
  especialidadesController.crear
);

EspecialidadesRoutes.put('/:id',
  autorizarUsuarios([3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numerico'), 
    check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto').isLength({ min: 3, max: 120 }).withMessage('El nombre debe tener entre 3 y 120 caracteres'), 
    check('activo').optional().isBoolean().withMessage('El campo activo debe ser true o false'), 
    validarCampos
  ], 
  especialidadesController.editar
);

EspecialidadesRoutes.delete("/:id",
  autorizarUsuarios([3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numerico'),
    validarCampos
  ],
  especialidadesController.eliminar
);

EspecialidadesRoutes.patch("/:id",
  autorizarUsuarios([3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numerico'), 
    validarCampos
  ],
  especialidadesController.restaurar
);

