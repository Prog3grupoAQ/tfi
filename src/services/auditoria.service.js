import { AuditoriaDatabase } from "../database/auditoria.database.js";

export class AuditoriaService {
  constructor() {
    this.db = new AuditoriaDatabase();
  }

  registrar = async (registro) => {
    return await this.db.registrar(registro);
  };

  listarTodos = async (filtros = {}) => {
    return await this.db.listarTodos(filtros);
  };
}
