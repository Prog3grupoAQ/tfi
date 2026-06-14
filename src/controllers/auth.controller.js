import jwt from "jsonwebtoken";
import passport from "passport";
import { AuditoriaService } from "../services/auditoria.service.js";

export class AuthController {
  constructor() {
    this.auditoria = new AuditoriaService();
  }

  login = async (req, res) => {
    passport.authenticate("local", { session: false }, (err, usuario) => {
      if (err || !usuario) {
        // registro intento de login fallido
        this.auditoria.registrar({
          id_usuario: null,
          email: req.body.email || "desconocido",
          accion: `Intento de inicio de sesión fallido para ${req.body.email || "desconocido"}`,
          metodo: req.method,
          endpoint: req.originalUrl,
          status_code: 401,
          ip: req.ip,
        }).catch(e => console.error("Error en auditoría:", e.message));

        return res.status(401).json({
          estado: false,
          mensaje: "Email o contraseña incorrectos",
        });
      }

      req.login(usuario, { session: false }, (error) => {
        if (error) {
          return res.status(500).json({
            estado: false,
            mensaje: "Error al iniciar sesión",
          });
        }

        const token = jwt.sign(
          {
            id_usuario: usuario.id_usuario,
            rol: usuario.rol,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "8h",
          },
        );

        // registro login exitoso
        this.auditoria.registrar({
          id_usuario: usuario.id_usuario,
          email: req.body.email,
          accion: `${req.body.email} inició sesión`,
          metodo: req.method,
          endpoint: req.originalUrl,
          status_code: 200,
          ip: req.ip,
        }).catch(e => console.error("Error en auditoría:", e.message));

        return res.json({
          estado: true,
          token,
        });
      });
    })(req, res);
  };
}
