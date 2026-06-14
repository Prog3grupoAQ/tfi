import { Database } from "./conexion.js";

export class AuditoriaDatabase {
  registrar = async (registro) => {
    const { id_usuario, email, accion, metodo, endpoint, status_code, ip } = registro;
    const query = `
      INSERT INTO auditoria (id_usuario, email, accion, metodo, endpoint, status_code, ip)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await Database.query(query, [
      id_usuario ?? null,
      email,
      accion,
      metodo,
      endpoint,
      status_code ?? null,
      ip ?? null,
    ]);
    return result.insertId;
  };

  listarTodos = async (filtros = {}) => {
    let query = `SELECT * FROM auditoria`;
    const params = [];
    const condiciones = [];

    if (filtros.id_usuario) {
      condiciones.push(`id_usuario = ?`);
      params.push(filtros.id_usuario);
    }

    if (filtros.email) {
      condiciones.push(`email LIKE ?`);
      params.push(`%${filtros.email}%`);
    }

    if (filtros.accion) {
      condiciones.push(`accion LIKE ?`);
      params.push(`%${filtros.accion}%`);
    }

    if (condiciones.length > 0) {
      query += ` WHERE ` + condiciones.join(" AND ");
    }

    query += ` ORDER BY fecha_hora DESC`;

    if (filtros.limite) {
      query += ` LIMIT ?`;
      params.push(Number(filtros.limite));
    }

    const [results] = await Database.query(query, params);
    return results;
  };
}
