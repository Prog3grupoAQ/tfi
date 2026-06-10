import { TurnosReservasService } from "../services/turnos_reservas.service.js";
import { PacientesService } from "../services/pacientes.service.js";
import { MedicosService } from "../services/medicos.service.js";

export class TurnosReservasController {
  constructor() {
    this.turnos = new TurnosReservasService();
  }

  listarTodos = async (req, res) => {
    try {
      const { medico, paciente } = req.query;
      const usuario = req.user;
      const filtros = {};

      if (!usuario) {
        return res.status(401).json({ estado: false, msg: "Usuario no autenticado" });
      }

      if (usuario.rol === 2) {
        // Paciente
        const pacienteService = new PacientesService();
        const pacienteUsuario = await pacienteService.buscarPorUsuario(usuario.id_usuario);
        if (!pacienteUsuario || pacienteUsuario.length === 0) {
          return res.status(403).json({ estado: false, msg: "Paciente no encontrado" });
        }
        filtros.id_paciente = pacienteUsuario[0].id_paciente;
      } else if (usuario.rol === 1) {
        // Médico
        const medicoService = new MedicosService();
        const medicoUsuario = await medicoService.buscarPorUsuario(usuario.id_usuario);
        if (!medicoUsuario || medicoUsuario.length === 0) {
          return res.status(403).json({ estado: false, msg: "Médico no encontrado" });
        }
        filtros.id_medico = medicoUsuario[0].id_medico;
      } else if (usuario.rol === 3) {
        // Admin
        if (medico) filtros.id_medico = medico;
        if (paciente) filtros.id_paciente = paciente;
      } else {
        return res.status(403).json({ estado: false, msg: "Acceso denegado" });
      }

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
      const usuario = req.user;

      if (!usuario) {
        return res.status(401).json({ estado: false, msg: "Usuario no autenticado" });
      }

      const resultado = await this.turnos.buscarPorId(id);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "Turno no encontrado" });

      const turno = resultado[0];

      if (usuario.rol === 2) {
        const pacienteService = new PacientesService();
        const pacienteUsuario = await pacienteService.buscarPorUsuario(usuario.id_usuario);
        if (!pacienteUsuario || pacienteUsuario.length === 0 || turno.id_paciente !== pacienteUsuario[0].id_paciente) {
          return res.status(403).json({ estado: false, msg: "Acceso denegado" });
        }
      } else if (usuario.rol === 1) {
        const medicoService = new MedicosService();
        const medicoUsuario = await medicoService.buscarPorUsuario(usuario.id_usuario);
        if (!medicoUsuario || medicoUsuario.length === 0 || turno.id_medico !== medicoUsuario[0].id_medico) {
          return res.status(403).json({ estado: false, msg: "Acceso denegado" });
        }
      } else if (usuario.rol !== 3) {
        return res.status(403).json({ estado: false, msg: "Acceso denegado" });
      }

      return res.json({ estado: true, data: turno });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  crear = async (req, res) => {
    try {
      const { id_medico, id_paciente, id_obra_social, fecha_hora } = req.body;
      const usuario = req.user;

      if (!usuario) {
        return res.status(401).json({ estado: false, msg: "Usuario no autenticado" });
      }

      if (usuario.rol === 2) {
        const pacienteService = new PacientesService();
        const pacienteUsuario = await pacienteService.buscarPorUsuario(usuario.id_usuario);
        if (!pacienteUsuario || pacienteUsuario.length === 0 || Number(id_paciente) !== pacienteUsuario[0].id_paciente) {
          return res.status(403).json({ estado: false, msg: "Acceso denegado: no puede reservar turnos para otro paciente" });
        }
      } else if (usuario.rol !== 3) {
        return res.status(403).json({ estado: false, msg: "Acceso denegado" });
      }

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
      const usuario = req.user;

      if (!usuario) {
        return res.status(401).json({ estado: false, msg: "Usuario no autenticado" });
      }

      const turnoArr = await this.turnos.buscarPorId(id);
      if (!turnoArr || turnoArr.length === 0)
        return res.status(404).json({ estado: false, msg: "Turno no encontrado" });

      const turno = turnoArr[0];

      if (usuario.rol === 1) {
        const medicoService = new MedicosService();
        const medicoUsuario = await medicoService.buscarPorUsuario(usuario.id_usuario);
        if (!medicoUsuario || medicoUsuario.length === 0 || turno.id_medico !== medicoUsuario[0].id_medico) {
          return res.status(403).json({ estado: false, msg: "Acceso denegado" });
        }
      } else if (usuario.rol !== 3) {
        return res.status(403).json({ estado: false, msg: "Acceso denegado" });
      }

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
      const usuario = req.user;

      if (!usuario) {
        return res.status(401).json({ estado: false, msg: "Usuario no autenticado" });
      }

      const turnoArr = await this.turnos.buscarPorId(id);
      if (!turnoArr || turnoArr.length === 0)
        return res.status(404).json({ estado: false, msg: "Turno no encontrado o ya eliminado" });

      const turno = turnoArr[0];

      if (usuario.rol === 2) {
        const pacienteService = new PacientesService();
        const pacienteUsuario = await pacienteService.buscarPorUsuario(usuario.id_usuario);
        if (!pacienteUsuario || pacienteUsuario.length === 0 || turno.id_paciente !== pacienteUsuario[0].id_paciente) {
          return res.status(403).json({ estado: false, msg: "Acceso denegado" });
        }
      } else if (usuario.rol === 1) {
        const medicoService = new MedicosService();
        const medicoUsuario = await medicoService.buscarPorUsuario(usuario.id_usuario);
        if (!medicoUsuario || medicoUsuario.length === 0 || turno.id_medico !== medicoUsuario[0].id_medico) {
          return res.status(403).json({ estado: false, msg: "Acceso denegado" });
        }
      } else if (usuario.rol !== 3) {
        return res.status(403).json({ estado: false, msg: "Acceso denegado" });
      }

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
      const usuario = req.user;

      if (!usuario) {
        return res.status(401).json({ estado: false, msg: "Usuario no autenticado" });
      }

      if (usuario.rol !== 3) {
        return res.status(403).json({ estado: false, msg: "Acceso denegado" });
      }

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
