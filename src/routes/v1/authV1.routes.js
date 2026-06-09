import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../../middlewares/validarCampos.js";
import { AuthController } from "../../controllers/auth.controller.js";

import { autenticarUsuario } from "../../middlewares/autenticarUsuario.js";
import { autorizarUsuarios } from "../../middlewares/autorizarUsuarios.js";

export const AuthRoutes = Router();

const authController = new AuthController();

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

AuthRoutes.get("/perfil", autenticarUsuario, (req, res) => {
  return res.json({
    estado: true,
    usuario: req.user,
  });
});
