import { Database } from "./conexion.js";

export class MedicosDatabase {
  listarTodos = async (id_especialidad = null) => {
    const params = [];

    let query = `SELECT vm.*, m.id_especialidad, e.nombre AS especialidad
      FROM v_medicos AS vm
      INNER JOIN medicos AS m ON vm.id_medico = m.id_medico
      INNER JOIN especialidades AS e ON m.id_especialidad = e.id_especialidad`;

    if (id_especialidad) {
      query += ` WHERE m.id_especialidad = ?`;
      params.push(id_especialidad);
    }

    const [results] = await Database.query(query, params);
    return results;
  };

  buscarPorId = async (id) => {
    const query = `SELECT vm.*, m.id_especialidad, e.nombre AS especialidad
      FROM v_medicos AS vm
      INNER JOIN medicos AS m ON vm.id_medico = m.id_medico
      INNER JOIN especialidades AS e ON m.id_especialidad = e.id_especialidad
      WHERE vm.id_medico = ?`;
    const [results] = await Database.query(query, [id]);
    return results;
  };

  buscarPorMatricula = async (matricula) => {
    const query = "SELECT * FROM medicos WHERE matricula = ?";
    const [results] = await Database.query(query, [matricula]);
    return results;
  };

  crear = async (medico) => {
    const { id_usuario, id_especialidad, matricula, descripcion, valor_consulta } = medico;
    const query = `INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) 
      VALUES (?, ?, ?, ?, ?)`;
    const [result] = await Database.query(query, [id_usuario, id_especialidad, matricula, descripcion, valor_consulta]);
    if (result.affectedRows === 0) return null;
    return result.insertId;
  };

  editar = async (id, medico) => {
    const { id_especialidad, descripcion, valor_consulta } = medico;
    const query = `UPDATE medicos SET id_especialidad = ?, descripcion = ?, valor_consulta = ? 
      WHERE id_medico = ?`;
    const [result] = await Database.query(query, [id_especialidad, descripcion, valor_consulta, id]);
    return result;
  };

  eliminar = async (id) => {
    const query = "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?";
    const [result] = await Database.query(query, [id]);
    return result;
  };
}
