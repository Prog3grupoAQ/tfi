import { PacientesService } from "../services/pacientes.service.js";
import { ObrasSocialesService } from "../services/obras_sociales.service.js";

export class PacientesController {
  constructor() {
    this.pacientes = new PacientesService();
    this.obrasSociales = new ObrasSocialesService();
  }

  listarTodos = async (req, res) => {
    try {
      const { obra_social } = req.query;
      const resultado = await this.pacientes.listarTodos(obra_social || null);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "No se encontraron pacientes" });

      return res.json({ estado: true, data: resultado });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = req.user;

      if (!usuario) {
        return res.status(401).json({ estado: false, msg: "Usuario no autenticado" });
      }

      if (usuario.rol === 2) {
        const pacienteUsuario = await this.pacientes.buscarPorUsuario(usuario.id_usuario);
        if (!pacienteUsuario || pacienteUsuario.length === 0 || pacienteUsuario[0].id_paciente !== Number(id)) {
          return res.status(403).json({ estado: false, msg: "Acceso denegado: no puede ver otro paciente" });
        }
      }

      const resultado = await this.pacientes.buscarPorId(id);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "Paciente no encontrado" });

      return res.json({ estado: true, data: resultado[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  crear = async (req, res) => {
    try {
      const { id_usuario, id_obra_social } = req.body;
      const nuevoPaciente = await this.pacientes.crear({ id_usuario, id_obra_social });

      if (nuevoPaciente?.duplicado)
        return res.status(409).json({ estado: false, msg: "Ya existe un paciente con ese usuario" });

      if (!nuevoPaciente || nuevoPaciente.length === 0)
        return res.status(400).json({ estado: false, msg: "No se pudo crear el paciente." });

      return res.status(201).json({ estado: true, msg: "Paciente creado correctamente", data: nuevoPaciente[0] });
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

      if (usuario.rol === 2) {
        const pacienteUsuario = await this.pacientes.buscarPorUsuario(usuario.id_usuario);
        if (!pacienteUsuario || pacienteUsuario.length === 0 || pacienteUsuario[0].id_paciente !== Number(id)) {
          return res.status(403).json({ estado: false, msg: "Acceso denegado: no puede editar otro paciente" });
        }
      } else if (usuario.rol !== 3) {
        return res.status(403).json({ estado: false, msg: "Acceso denegado" });
      }

      const { id_obra_social } = req.body;

      const obraSocial = await this.obrasSociales.buscarPorId(id_obra_social);
      if (!obraSocial || obraSocial.length === 0)
        return res.status(422).json({ estado: false, msg: "La obra social no existe" });

      const resultado = await this.pacientes.editar(id, { id_obra_social });

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Paciente no encontrado" });

      const msg = resultado.changed
        ? "Paciente editado correctamente"
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
      const resultado = await this.pacientes.eliminar(id);

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Paciente no encontrado" });

      return res.status(200).json({ estado: true, msg: "Paciente eliminado" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };
}
