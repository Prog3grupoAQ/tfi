import { PacientesDatabase } from "../database/pacientes.database.js";

export class PacientesService {
  constructor() {
    this.db = new PacientesDatabase();
  }

  listarTodos = async (id_obra_social = null) => {
    return await this.db.listarTodos(id_obra_social);
  };

  buscarPorId = async (id) => {
    return await this.db.buscarPorId(id);
  };

  buscarPorUsuario = async (id_usuario) => {
    return await this.db.buscarPorUsuario(id_usuario);
  };

  crear = async (paciente) => {
    const { id_usuario } = paciente;
    const existente = await this.buscarPorUsuario(id_usuario);
    if (existente && existente.length > 0) return { duplicado: true };

    const nuevo_id = await this.db.crear(paciente);
    if (!nuevo_id) return null;

    return this.buscarPorId(nuevo_id);
  };

  editar = async (id, paciente) => {
    const result = await this.db.editar(id, paciente);
    if (result.affectedRows === 0) return null;

    const data = await this.buscarPorId(id);
    return { changed: result.changedRows > 0, data };
  };

  eliminar = async (id) => {
    const existe = await this.buscarPorId(id);
    if (!existe || existe.length === 0) return null;
    return await this.db.eliminar(id);
  };
}
