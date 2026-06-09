import { TurnosReservasDatabase } from "../database/turnos_reservas.database.js";

export class TurnosReservasService {
  constructor() {
    this.db = new TurnosReservasDatabase();
  }

  listarTodos = async (filtros = {}) => {
    return await this.db.listarTodos(filtros);
  };

  buscarPorId = async (id) => {
    return await this.db.buscarPorId(id);
  };

  crear = async (turno) => {
    try {
      const nuevo_id = await this.db.crear(turno);
      if (!nuevo_id) return null;

      return this.buscarPorId(nuevo_id);
    } catch (error) {
      if (error.tipo) return { error: error.tipo };
      throw error;
    }
  };

  marcarAtendido = async (id) => {
    const existe = await this.buscarPorId(id);
    if (!existe || existe.length === 0) return null;

    if (existe[0].atendido) return { yaAtendido: true };

    const result = await this.db.marcarAtendido(id);
    if (result.affectedRows === 0) return null;

    return this.buscarPorId(id);
  };

  eliminar = async (id) => {
    const existe = await this.buscarPorId(id);
    if (!existe || existe.length === 0) return null;
    return await this.db.eliminar(id);
  };

  restaurar = async (id) => {
    const result = await this.db.restaurar(id);
    if (result.affectedRows === 0) return null;
    return result;
  };
}
