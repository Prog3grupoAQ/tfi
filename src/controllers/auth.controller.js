import jwt from "jsonwebtoken";
import passport from "passport";

export class AuthController {
  login = async (req, res) => {
    passport.authenticate("local", { session: false }, (err, usuario) => {
      if (err || !usuario) {
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

        return res.json({
          estado: true,
          token,
        });
      });
    })(req, res);
  };
}
