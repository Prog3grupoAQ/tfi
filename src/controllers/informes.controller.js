import { InformesService } from "../services/informes.service.js";

export class InformesController {
  constructor() {
    this.informes = new InformesService();
  }

  generarInformeObrasSociales = async (req, res) => {
    try {
      const reporte = await this.informes.reportePorObrasSociales();
      res.set(reporte.headers);
      return res.send(reporte.buffer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno al generar el informe de obras sociales" });
    }
  };

  generarInformeEspecialidades = async (req, res) => {
    try {
      const reporte = await this.informes.reportePorEspecialidades();
      res.set(reporte.headers);
      return res.send(reporte.buffer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno al generar el informe de especialidades" });
    }
  };
}
