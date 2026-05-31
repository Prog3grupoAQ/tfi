import { EspecialidadesDB } from "../database/especialidades.database.js";
import { Database } from "../database/conexion.js";

export class EspecialidadesService{

  constructor(){
    this.database = new EspecialidadesDB();
  }

  listarTodas = async (inactivos = false) => {
    const results = await this.database.listar( inactivos )
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

  crear = async (nombre, activo) => {
    const query = "INSERT INTO especialidades (nombre, activo) VALUES (?, ?)";
    const [response] = await Database.query(query, [nombre, activo]);
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