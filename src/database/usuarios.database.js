import { Database } from "./conexion.js";

export class UsuariosDatabase {
  buscarPorDocumentoOEmail = async (documento, email) => {
    const query = `SELECT id_usuario FROM usuarios WHERE documento = ? OR email = ?`;
    const [results] = await Database.query(query, [documento, email]);
    return results;
  };

  crear = async (usuario) => {
    const { documento, apellido, nombres, email, contrasenia, foto_path, rol } =
      usuario;
    const query = `
      INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol)
      VALUES (?, ?, ?, ?, SHA2(?, 256), ?, ?)
    `;
    const [result] = await Database.query(query, [
      documento,
      apellido,
      nombres,
      email,
      contrasenia,
      foto_path,
      rol,
    ]);
    if (result.affectedRows === 0) return null;
    return result.insertId;
  };

  buscar = async (email, contrasenia) => {
    const query = `
    SELECT
      id_usuario,
      CONCAT(nombres, ' ', apellido) AS usuario,
      rol
    FROM usuarios
    WHERE email = ?
      AND contrasenia = SHA2(?, 256)
      AND activo = 1
  `;

    const [results] = await Database.query(query, [email, contrasenia]);

    return results[0] || null;
  };

  buscarPorId = async (id_usuario) => {
    const query = `
    SELECT *
    FROM usuarios
    WHERE id_usuario = ?
      AND activo = 1
  `;

    const [results] = await Database.query(query, [id_usuario]);

    return results[0] || null;
  };
}
