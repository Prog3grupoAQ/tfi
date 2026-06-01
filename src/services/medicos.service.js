import { MedicosDatabase } from "../database/medicos.database.js";

export class MedicosService {
  constructor() {
    this.db = new MedicosDatabase();
  }

  listarTodos = async (id_especialidad = null) => {
    return await this.db.listarTodos(id_especialidad);
  };

  buscarPorId = async (id) => {
    return await this.db.buscarPorId(id);
  };

  crear = async (medico) => {
    const nuevo_id = await this.db.crear(medico);
    if (!nuevo_id) return null;

    return this.buscarPorId(nuevo_id);
  };

  editar = async (id, medico) => {
    const result = await this.db.editar(id, medico);
    if (result.affectedRows === 0) return null;

    const data = await this.buscarPorId(id);
    return { changed: result.changedRows > 0, data };
  };
}
