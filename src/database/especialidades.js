import { Database } from "./conexion.js";

export class EspecialidadesModel {
  listarTodas = async (inactivos = false) => {
    const where = !inactivos ? "WHERE activo = 1" : "";
    const query = `SELECT * FROM especialidades ${where}`;
    const [results] = await Database.query(query);
    return results;
  };

  buscar = async (id) => {
    const query = "SELECT * FROM especialidades AS e WHERE e.id_especialidad = ? AND e.activo = 1";
    const [results] = await Database.query(query, [id]);
    return results;
  };

  editar = async (id, nombre, activo) => {
    if (activo === undefined) {
      const query = "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1";
      const [results] = await Database.query(query, [nombre, id]);
      return results;
    }
    const query = "UPDATE especialidades SET nombre = ?, activo = ? WHERE id_especialidad = ? AND activo = 1";
    const [results] = await Database.query(query, [nombre, activo, id]);
    return results;
  };

  crear = async (nombre) => {
    // Se omite 'activo' del INSERT para usar el DEFAULT 1 de la db
    const query = "INSERT INTO especialidades (nombre) VALUES (?)";
    const [response] = await Database.query(query, [nombre]);
    return response;
  };

  eliminar = async (id) => {
    const query = `UPDATE especialidades SET activo = 0 WHERE id_especialidad = ? AND activo = 1`;
    const [results] = await Database.query(query, [id]);
    return results;
  };

  restaurar = async (id) => {
    const query = `UPDATE especialidades SET activo = 1 WHERE id_especialidad = ? AND activo = 0`;
    const [results] = await Database.query(query, [id]);
    return results;
  };
}
