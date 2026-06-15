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

  buscarPorUsuario = async (id_usuario) => {
    const query = `SELECT vm.*, m.id_especialidad, e.nombre AS especialidad
      FROM v_medicos AS vm
      INNER JOIN medicos AS m ON vm.id_medico = m.id_medico
      INNER JOIN especialidades AS e ON m.id_especialidad = e.id_especialidad
      WHERE vm.id_usuario = ?`;
    const [results] = await Database.query(query, [id_usuario]);
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

  asociarObrasSociales = async (id_medico, obras_sociales) => {
    const connection = await Database.getConnection();
    try {
      await connection.beginTransaction();

      for (const id_obra_social of obras_sociales) {
        const [os] = await connection.query(
          "SELECT id_obra_social FROM obras_sociales WHERE id_obra_social = ? AND activo = 1",
          [id_obra_social]
        );
        if (os.length === 0) {
          await connection.rollback();
          return { error: `Obra social con id ${id_obra_social} no encontrada o inactiva` };
        }
      }

      await connection.query(
        "UPDATE medicos_obras_sociales SET activo = 0 WHERE id_medico = ? AND activo = 1",
        [id_medico]
      );

      for (const id_obra_social of obras_sociales) {
        await connection.query(
          "INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?)",
          [id_medico, id_obra_social]
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
}
