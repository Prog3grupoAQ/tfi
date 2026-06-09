import { Database } from "./conexion.js";

export class UsuariosDatabase {
  buscarPorDocumentoOEmail = async (documento, email) => {
    const query = `SELECT id_usuario FROM usuarios WHERE documento = ? OR email = ?`;
    const [results] = await Database.query(query, [documento, email]);
    return results;
  };

  crear = async (usuario) => {
    const { documento, apellido, nombres, email, contrasenia, foto_path, rol } = usuario;
    const query = `
      INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol)
      VALUES (?, ?, ?, ?, SHA2(?, 256), ?, ?)
    `;
    const [result] = await Database.query(query, [documento, apellido, nombres, email, contrasenia, foto_path, rol]);
    if (result.affectedRows === 0) return null;
    return result.insertId;
  };
}
