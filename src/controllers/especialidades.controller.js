import { EspecialidadesService } from "../services/especialidades.service.js";

export class EspecialidadesController {
  constructor() {
    this.especialidades = new EspecialidadesService();
  }

  listarTodas = async (req, res) => {
    try {
      const inactivos = req.query.inactivos === "true";
      const resultado = await this.especialidades.listarTodas(inactivos);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "No se encontraron especialidades" });

      return res.json({ estado: true, data: resultado });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.especialidades.buscarPorId(id);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "Especialidad no encontrada" });

      return res.json({ estado: true, data: resultado[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  crear = async (req, res) => {
    try {
      const { nombre } = req.body;
      const nuevaEspecialidad = await this.especialidades.crear({ nombre });

      if (!nuevaEspecialidad || nuevaEspecialidad.length === 0)
        return res.status(400).json({ estado: false, msg: "No se pudo crear la especialidad." });

      return res.status(201).json({ estado: true, msg: "Especialidad creada correctamente", data: nuevaEspecialidad[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, activo } = req.body;
      const resultado = await this.especialidades.editar(id, { nombre, activo });

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Especialidad no encontrada o inactiva" });

      const msg = resultado.changed
        ? "Especialidad editada correctamente"
        : "Sin cambios (los datos enviados son idénticos a los actuales)";

      return res.status(200).json({ estado: true, msg, data: resultado.data[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.especialidades.eliminar(id);

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Especialidad no encontrada o ya eliminada" });

      return res.status(200).json({ estado: true, msg: "Especialidad eliminada" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  restaurar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.especialidades.restaurar(id);

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Especialidad no encontrada o ya activa" });

      return res.status(200).json({ estado: true, msg: "Especialidad restaurada correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };
}
