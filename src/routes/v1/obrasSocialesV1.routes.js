import { Router } from "express";
import { param, check, query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { ObrasSocialesController } from "../../controllers/obras_sociales.controller.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";

export const ObrasSocialesRoutes = Router();

const obrasSocialesController = new ObrasSocialesController();

/**
 * @swagger
 * tags:
 *   name: Obras Sociales
 *   description: Gestión de obras sociales
 */

/**
 * @swagger
 * /obras_sociales:
 *   get:
 *     summary: Listar todas las obras sociales
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: inactivos
 *         schema:
 *           type: boolean
 *         description: Incluir obras sociales inactivas
 *     responses:
 *       200:
 *         description: Lista de obras sociales
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
 *                     $ref: '#/components/schemas/ObraSocial'
 *       401:
 *         description: No autenticado
 *   post:
 *     summary: Crear una nueva obra social
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, descripcion]
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 120
 *                 example: "OSDE"
 *               descripcion:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Obra social privada"
 *               porcentaje_descuento:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.20
 *                 description: "Porcentaje en decimal (0.20 = 20%)"
 *               es_particular:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Obra social creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ObraSocial'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos (requiere rol admin)
 */
ObrasSocialesRoutes.get("/",
  autorizarUsuarios([1, 2, 3]),
  [
    query('inactivos').optional().isBoolean().withMessage('El parámetro inactivos debe ser true o false'),
    validarCampos
  ],
  obrasSocialesController.listarTodas
);

/**
 * @swagger
 * /obras_sociales/{id}:
 *   get:
 *     summary: Obtener una obra social por ID
 *     tags: [Obras Sociales]
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
 *         description: Obra social encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ObraSocial'
 *       404:
 *         description: Obra social no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Actualizar una obra social
 *     tags: [Obras Sociales]
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
 *             required: [nombre, descripcion]
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 120
 *                 example: "OSDE"
 *               descripcion:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Obra social privada"
 *               porcentaje_descuento:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.20
 *                 description: "Porcentaje en decimal (0.20 = 20%)"
 *               es_particular:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Obra social actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ObraSocial'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos (requiere rol admin)
 *       404:
 *         description: Obra social no encontrada
 *   delete:
 *     summary: Eliminar una obra social (soft delete)
 *     tags: [Obras Sociales]
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
 *         description: Obra social eliminada
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
 *                   example: "Obra social eliminada correctamente"
 *       403:
 *         description: Sin permisos (requiere rol admin)
 *       404:
 *         description: Obra social no encontrada
 *   patch:
 *     summary: Restaurar una obra social eliminada
 *     tags: [Obras Sociales]
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
 *         description: Obra social restaurada
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
 *                   example: "Obra social restaurada correctamente"
 *       403:
 *         description: Sin permisos (requiere rol admin)
 *       404:
 *         description: Obra social no encontrada
 */
ObrasSocialesRoutes.get("/:id",
  autorizarUsuarios([1, 2, 3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  obrasSocialesController.buscarPorId
);

// swagger documentado en el bloque /obras_sociales de arriba
ObrasSocialesRoutes.post("/",
  autorizarUsuarios([3]),
  [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto').isLength({ min: 3, max: 120 }).withMessage('El nombre debe tener entre 3 y 120 caracteres'),
    check('descripcion').notEmpty().withMessage('La descripción es obligatoria').isString().withMessage('La descripción debe ser un texto').isLength({ max: 255 }).withMessage('La descripción no puede superar los 255 caracteres'),
    check('porcentaje_descuento').optional().isFloat({ min: 0, max: 1 }).withMessage('El porcentaje de descuento debe ser un número entre 0 y 1 (ej: 0.20 para 20%)'),
    check('es_particular').optional().isBoolean().withMessage('El campo es_particular debe ser true o false'),
    validarCampos
  ],
  obrasSocialesController.crear
);

// swagger documentado en el bloque /obras_sociales/{id} de arriba
ObrasSocialesRoutes.put("/:id",
  autorizarUsuarios([3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    check('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto').isLength({ min: 3, max: 120 }).withMessage('El nombre debe tener entre 3 y 120 caracteres'),
    check('descripcion').notEmpty().withMessage('La descripción es obligatoria').isString().withMessage('La descripción debe ser un texto').isLength({ max: 255 }).withMessage('La descripción no puede superar los 255 caracteres'),
    check('porcentaje_descuento').optional().isFloat({ min: 0, max: 1 }).withMessage('El porcentaje de descuento debe ser un número entre 0 y 1 (ej: 0.20 para 20%)'),
    check('es_particular').optional().isBoolean().withMessage('El campo es_particular debe ser true o false'),
    validarCampos
  ],
  obrasSocialesController.editar
);

// swagger documentado en el bloque /obras_sociales/{id} de arriba
ObrasSocialesRoutes.delete("/:id",
  autorizarUsuarios([3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  obrasSocialesController.eliminar
);

// swagger documentado en el bloque /obras_sociales/{id} de arriba
ObrasSocialesRoutes.patch("/:id",
  autorizarUsuarios([3]),
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  obrasSocialesController.restaurar
);
