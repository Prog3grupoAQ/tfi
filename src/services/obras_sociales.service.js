import { ObrasSocialesDatabase } from "../database/obras_sociales.database.js";

export class ObrasSocialesService {
  constructor() {
    this.db = new ObrasSocialesDatabase();
  }

  listarTodas = async (inactivos = false) => {
    return await this.db.listarTodas(inactivos);
  };

  buscarPorId = async (id) => {
    return await this.db.buscarPorId(id);
  };

  buscarPorNombre = async (nombre, excluirId = null) => {
    return await this.db.buscarPorNombre(nombre, excluirId);
  };

  crear = async (obraSocial) => {
    const nuevo_id = await this.db.crear(obraSocial);
    if (!nuevo_id) return null;

    return this.buscarPorId(nuevo_id);
  };

  editar = async (id, obraSocial) => {
    const result = await this.db.editar(id, obraSocial);
    if (result.affectedRows === 0) return null;

    const data = await this.buscarPorId(id);
    return { changed: result.changedRows > 0, data };
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
