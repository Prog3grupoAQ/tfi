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

      if (nuevoMedico?.duplicado)
        return res.status(409).json({ estado: false, msg: "Ya existe un médico con esa matrícula" });

      if (!nuevoMedico || nuevoMedico.length === 0)
        return res.status(400).json({ estado: false, msg: "No se pudo crear el médico." });

      return res.status(201).json({ estado: true, msg: "Médico creado correctamente", data: nuevoMedico[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = req.user;

      if (!usuario) {
        return res.status(401).json({ estado: false, msg: "Usuario no autenticado" });
      }

      if (usuario.rol === 1) {
        const medicosUsuario = await this.medicos.buscarPorUsuario(usuario.id_usuario);
        if (!medicosUsuario || medicosUsuario.length === 0 || medicosUsuario[0].id_medico !== Number(id)) {
          return res.status(403).json({ estado: false, msg: "Acceso denegado: no puede editar otro médico" });
        }
      } else if (usuario.rol !== 3) {
        return res.status(403).json({ estado: false, msg: "Acceso denegado" });
      }

      const { id_especialidad, descripcion, valor_consulta } = req.body;
      const resultado = await this.medicos.editar(id, { id_especialidad, descripcion, valor_consulta });

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Médico no encontrado" });

      const msg = resultado.changed
        ? "Médico editado correctamente"
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
      const resultado = await this.medicos.eliminar(id);

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Medico no encontrado" });

      return res.status(200).json({ estado: true, msg: "Medico eliminado" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };
}
