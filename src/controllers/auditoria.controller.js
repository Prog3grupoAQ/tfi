import { AuditoriaService } from "../services/auditoria.service.js";

export class AuditoriaController {
  constructor() {
    this.auditoria = new AuditoriaService();
  }

  listarTodos = async (req, res) => {
    try {
      const { email, id_usuario, accion, limite } = req.query;
      const resultado = await this.auditoria.listarTodos({ email, id_usuario, accion, limite });

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "No se encontraron registros de auditoría" });

      return res.json({ estado: true, data: resultado });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };
}
