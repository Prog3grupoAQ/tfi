import { AuditoriaService } from "../services/auditoria.service.js";


//  middleware de auditoría global
//  registra automáticamente todas las solicitudes de usuarios autenticados
//  usa res.on("finish") para no bloquear la respuesta.

export const auditoriaMiddleware = (req, res, next) => {
  res.on("finish", async () => {
    try {
      // solo registrar si el usuario está autenticado y tiene email
      if (!req.user || !req.user.email) return;

      // evito duplicar registros de login y registro que se auditan manualmente
      if (req.originalUrl.includes("/auth/login") || req.originalUrl.includes("/registro")) {
        return;
      }

      const auditoriaService = new AuditoriaService();
      await auditoriaService.registrar({
        id_usuario: req.user.id_usuario,
        email: req.user.email,
        accion: `${req.user.email} accedió a ${req.method} ${req.originalUrl}`,
        metodo: req.method,
        endpoint: req.originalUrl,
        status_code: res.statusCode,
        ip: req.ip,
      });
    } catch (error) {
      // no interrumpir la app si falla la auditoria
      console.error("Error en middleware de auditoría:", error.message);
    }
  });

  next();
};
