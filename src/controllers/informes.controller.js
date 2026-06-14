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

  generarInformeTurnosMedico = async (req, res) => {
    try {
      const { id_medico, mes, anio } = req.query;
      const reporte = await this.informes.reporteTurnosMedico(Number(id_medico), Number(mes), Number(anio));
      if (!reporte) return res.status(404).json({ estado: false, msg: "Médico no encontrado" });
      res.set(reporte.headers);
      return res.send(reporte.buffer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno al generar el informe del médico" });
    }
  };

  generarInformeTurnosCompletados = async (req, res) => {
    try {
      const { mes, anio } = req.query;
      const reporte = await this.informes.reporteTurnosCompletados(Number(mes), Number(anio));
      res.set(reporte.headers);
      return res.send(reporte.buffer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno al generar el informe de turnos" });
    }
  };
}
