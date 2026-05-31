import { Database } from "../database/conexion.js";

export class EspecialidadesDB{

    listar = async ( inactivos = false )=>{
        const where = !inactivos ? "WHERE activo = 1" : "";
        const query = `SELECT * FROM especialidades ${where}`;
        const [results] = await Database.query(query);
        return results
    }

    buscarPorId(id){
        const query = "SELECT * FROM especialidades AS e WHERE e.id_especialidad = ? AND e.activo = 1";
        const [results] = await Database.query(query, [id]);
        return results;
    }




}
