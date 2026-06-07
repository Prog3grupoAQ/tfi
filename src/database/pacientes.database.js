import { Database } from "./conexion.js";

export class PacientesDatabase {
  listarTodos = async (id_obra_social = null) => {
    const params = [];
    let query = "SELECT * FROM v_pacientes";

    if (id_obra_social) {
      query += " WHERE id_obra_social = ?";
      params.push(id_obra_social);
    }

    const [results] = await Database.query(query, params);
    return results;
  };

  buscarPorId = async (id) => {
    const query = "SELECT * FROM v_pacientes WHERE id_paciente = ?";
    const [results] = await Database.query(query, [id]);
    return results;
  };

  buscarPorUsuario = async (id_usuario) => {
    const query = "SELECT * FROM v_pacientes WHERE id_usuario = ?";
    const [results] = await Database.query(query, [id_usuario]);
    return results;
  };

  crear = async (paciente) => {
    const { id_usuario, id_obra_social } = paciente;
    const query = "INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)";
    const [result] = await Database.query(query, [id_usuario, id_obra_social]);
    if (result.affectedRows === 0) return null;
    return result.insertId;
  };

  editar = async (id, paciente) => {
    const { id_obra_social } = paciente;
    const query = "UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?";
    const [result] = await Database.query(query, [id_obra_social, id]);
    return result;
  };

  eliminar = async (id) => {
    const query = "DELETE FROM pacientes WHERE id_paciente = ?";
    const [result] = await Database.query(query, [id]);
    return result;
  };
}
