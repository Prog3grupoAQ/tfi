import { MedicosService } from "../services/medicos.service.js";

export class MedicosController {
  constructor() {
    this.medicos = new MedicosService();
  }

  listarTodos = async (req, res) => {
    try {
      const { especialidad } = req.query;
      const resultado = await this.medicos.listarTodos(especialidad || null);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "No se encontraron médicos" });

      return res.json({ estado: true, data: resultado });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.medicos.buscarPorId(id);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "Médico no encontrado" });

      return res.json({ estado: true, data: resultado[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  crear = async (req, res) => {
    try {
      const { id_usuario, id_especialidad, matricula, descripcion, valor_consulta } = req.body;
      const nuevoMedico = await this.medicos.crear({ id_usuario, id_especialidad, matricula, descripcion, valor_consulta });

      if (!nuevoMedico || nuevoMedico.length === 0)
        return res.status(400).json({ estado: false, msg: "No se pudo crear el médico." });

      return res.status(201).json({ estado: true, msg: "Médico creado correctamente", data: nuevoMedico[0] });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY")
        return res.status(409).json({ estado: false, msg: "Ya existe un médico con esa matrícula" });
      if (error.code === "ER_NO_REFERENCED_ROW_2")
        return res.status(400).json({ estado: false, msg: "El usuario o la especialidad referenciada no existe" });
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const { id_especialidad, descripcion, valor_consulta } = req.body;
      const resultado = await this.medicos.editar(id, { id_especialidad, descripcion, valor_consulta });

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Médico no encontrado" });

      const msg = resultado.changed
        ? "Médico editado correctamente"
        : "Sin cambios (los datos enviados son idénticos a los actuales)";

      return res.status(200).json({ estado: true, msg, data: resultado.data[0] });
    } catch (error) {
      if (error.code === "ER_NO_REFERENCED_ROW_2")
        return res.status(400).json({ estado: false, msg: "La especialidad referenciada no existe" });
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };
}
