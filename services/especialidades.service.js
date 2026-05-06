
import { Database } from "../database/conexion.js";

export const editarEspecialidadService = async( id, nombre, activo )=>{
    const query = "UPDATE especialidades SET nombre = ?, activo = ? WHERE id_especialidad = ?";
    const [results] = await Database.query( query, [ nombre, activo, id ] );
    return results;
}
