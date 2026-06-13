import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { uploadSingle } from "../../middlewares/upload.js";
import { RegistroController } from "../../controllers/registro.controller.js";

export const RegistroRoutes = Router();

const registroController = new RegistroController();

/**
 * @swagger
 * tags:
 *   name: Registro
 *   description: Registro de nuevos médicos y pacientes
 */

/**
 * @swagger
 * /registro/medico:
 *   post:
 *     summary: Registrar un nuevo médico
 *     tags: [Registro]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [documento, apellido, nombres, email, contrasenia, id_especialidad, matricula, valor_consulta]
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "30123456"
 *               apellido:
 *                 type: string
 *                 example: "García"
 *               nombres:
 *                 type: string
 *                 example: "Carlos Alberto"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "garcia@ejemplo.com"
 *               contrasenia:
 *                 type: string
 *                 example: "12345678"
 *               id_especialidad:
 *                 type: integer
 *                 example: 1
 *               matricula:
 *                 type: integer
 *                 example: 12345
 *               valor_consulta:
 *                 type: number
 *                 format: float
 *                 example: 5000.00
 *               descripcion:
 *                 type: string
 *                 example: "Especialista en cardiología"
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Médico registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 medico:
 *                   $ref: '#/components/schemas/Medico'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
RegistroRoutes.post("/medico",
  uploadSingle('foto'),
  [
    check('documento').notEmpty().withMessage('El documento es obligatorio'),
    check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    check('nombres').notEmpty().withMessage('Los nombres son obligatorios'),
    check('email').notEmpty().isEmail().withMessage('El email no es válido'),
    check('contrasenia').notEmpty().withMessage('La contraseña es obligatoria'),
    check('id_especialidad').notEmpty().isNumeric().withMessage('El id de especialidad debe ser numérico'),
    check('matricula').notEmpty().isNumeric().withMessage('La matrícula debe ser numérica'),
    check('descripcion').optional().isString(),
    check('valor_consulta').notEmpty().isDecimal().withMessage('El valor de consulta debe ser un número decimal'),
    validarCampos
  ],
  registroController.registrarMedico
);

/**
 * @swagger
 * /registro/paciente:
 *   post:
 *     summary: Registrar un nuevo paciente
 *     tags: [Registro]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [documento, apellido, nombres, email, contrasenia]
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "40987654"
 *               apellido:
 *                 type: string
 *                 example: "López"
 *               nombres:
 *                 type: string
 *                 example: "María Elena"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "lopez@ejemplo.com"
 *               contrasenia:
 *                 type: string
 *                 example: "12345678"
 *               id_obra_social:
 *                 type: integer
 *                 example: 1
 *                 descriptionn: "ID de obra social (por defecto 1)"
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Paciente registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 paciente:
 *                   $ref: '#/components/schemas/Paciente'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
RegistroRoutes.post("/paciente",
  uploadSingle('foto'),
  [
    check('documento').notEmpty().withMessage('El documento es obligatorio'),
    check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    check('nombres').notEmpty().withMessage('Los nombres son obligatorios'),
    check('email').notEmpty().isEmail().withMessage('El email no es válido'),
    check('contrasenia').notEmpty().withMessage('La contraseña es obligatoria'),
    check('id_obra_social').optional().isNumeric().withMessage('El id de obra social debe ser numérico'),
    validarCampos
  ],
  registroController.registrarPaciente
);
