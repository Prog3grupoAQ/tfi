import { UsuariosDatabase } from "../database/usuarios.database.js";

export class UsuariosService {
  constructor() {
    this.db = new UsuariosDatabase();
  }

  crear = async (usuario) => {
    const { documento, email } = usuario;
    const existente = await this.db.buscarPorDocumentoOEmail(documento, email);
    if (existente && existente.length > 0) return { duplicado: true };

    const nuevo_id = await this.db.crear(usuario);
    if (!nuevo_id) return null;
    return nuevo_id;
  };

  buscar = async (email, contrasenia) => {
    return await this.db.buscar(email, contrasenia);
  };

  buscarPorId = async (id_usuario) => {
    return await this.db.buscarPorId(id_usuario);
  };
}
