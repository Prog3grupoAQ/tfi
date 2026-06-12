import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../../middlewares/validarCampos.js";
import { AuthController } from "../../controllers/auth.controller.js";

import { autenticarUsuario } from "../../middlewares/autenticarUsuario.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";

export const AuthRoutes = Router();

const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y perfil de usuario
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, contrasenia]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@ejemplo.com
 *               contrasenia:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "aqwerq2341ast234523sdfsdfg..."
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
AuthRoutes.post(
  "/login",
  [
    check("email")
      .notEmpty()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("El email no es válido"),

    check("contrasenia").notEmpty().withMessage("La contraseña es obligatoria"),

    validarCampos,
  ],
  authController.login,
);

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 usuario:
 *                   type: object
 *       401:
 *         description: Token inválido o ausente
 */
AuthRoutes.get("/perfil", autenticarUsuario, (req, res) => {
  const { contrasenia, ...usuario } = req.user; 
  return res.json({
    estado: true,
    usuario
  });
});
