import { Database } from "./conexion.js";

export class EspecialidadesDatabase {
  listarTodas = async (inactivos = false) => {
    const where = !inactivos ? "WHERE activo = 1" : "";
    const query = `SELECT * FROM especialidades ${where}`;
    const [results] = await Database.query(query);
    return results;
  };

  buscarPorId = async (id) => {
    const query = "SELECT * FROM especialidades AS e WHERE e.id_especialidad = ? AND e.activo = 1";
    const [results] = await Database.query(query, [id]);
    return results;
  };

  crear = async (especialidad) => {
    const { nombre } = especialidad;
    const query = "INSERT INTO especialidades (nombre) VALUES (?)";
    const [result] = await Database.query(query, [nombre]);
    if (result.affectedRows === 0) return null;
    return result.insertId;
  };

  editar = async (id, especialidad) => {
    const { nombre, activo } = especialidad;
    if (activo === undefined) {
      const query = "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1";
      const [result] = await Database.query(query, [nombre, id]);
      return result;
    }
    const query = "UPDATE especialidades SET nombre = ?, activo = ? WHERE id_especialidad = ? AND activo = 1";
    const [result] = await Database.query(query, [nombre, activo, id]);
    return result;
  };

  eliminar = async (id) => {
    const query = "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ? AND activo = 1";
    const [result] = await Database.query(query, [id]);
    return result;
  };

  restaurar = async (id) => {
    const query = "UPDATE especialidades SET activo = 1 WHERE id_especialidad = ? AND activo = 0";
    const [result] = await Database.query(query, [id]);
    return result;
  };
}
