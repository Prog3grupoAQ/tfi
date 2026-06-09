import { TurnosReservasService } from "../services/turnos_reservas.service.js";

export class TurnosReservasController {
  constructor() {
    this.turnos = new TurnosReservasService();
  }

  listarTodos = async (req, res) => {
    try {
      const { medico, paciente } = req.query;
      const filtros = {};
      if (medico) filtros.id_medico = medico;
      if (paciente) filtros.id_paciente = paciente;

      const resultado = await this.turnos.listarTodos(filtros);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "No se encontraron turnos" });

      return res.json({ estado: true, data: resultado });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.turnos.buscarPorId(id);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "Turno no encontrado" });

      return res.json({ estado: true, data: resultado[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  crear = async (req, res) => {
    try {
      const { id_medico, id_paciente, id_obra_social, fecha_hora } = req.body;
      const nuevoTurno = await this.turnos.crear({ id_medico, id_paciente, id_obra_social, fecha_hora });

      if (nuevoTurno?.error === "MEDICO_NO_ENCONTRADO")
        return res.status(404).json({ estado: false, msg: "Médico no encontrado o inactivo" });

      if (nuevoTurno?.error === "PACIENTE_NO_ENCONTRADO")
        return res.status(404).json({ estado: false, msg: "Paciente no encontrado o inactivo" });

      if (nuevoTurno?.error === "OBRA_SOCIAL_NO_ENCONTRADA")
        return res.status(404).json({ estado: false, msg: "Obra social no encontrada o inactiva" });

      if (nuevoTurno?.error === "MEDICO_NO_TRABAJA_CON_OBRA_SOCIAL")
        return res.status(400).json({ estado: false, msg: "El médico no atiende la obra social seleccionada" });

      if (!nuevoTurno || nuevoTurno.length === 0)
        return res.status(400).json({ estado: false, msg: "No se pudo crear el turno" });

      return res.status(201).json({ estado: true, msg: "Turno creado correctamente", data: nuevoTurno[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  marcarAtendido = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.turnos.marcarAtendido(id);

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Turno no encontrado" });

      if (resultado.yaAtendido)
        return res.status(409).json({ estado: false, msg: "El turno ya fue marcado como atendido" });

      return res.status(200).json({ estado: true, msg: "Turno marcado como atendido", data: resultado[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.turnos.eliminar(id);

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Turno no encontrado o ya eliminado" });

      return res.status(200).json({ estado: true, msg: "Turno eliminado" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  restaurar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.turnos.restaurar(id);

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Turno no encontrado o ya activo" });

      return res.status(200).json({ estado: true, msg: "Turno restaurado correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };
}
