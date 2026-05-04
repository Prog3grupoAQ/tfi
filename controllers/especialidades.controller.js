
import { Database } from "../database/conexion.js";

export const buscarEspecialidad = async( req, res )=>{
    try{
        const { id } = req.params;
        let query = "SELECT * FROM especialidades AS e WHERE e.activo = 1 AND e.id_especialidad = ? ";
        const [results, fields] = await Database.query( query, id );

        if ( results.length == 0 ) res.status(404);
        res.send(results);
    }catch(error){
        console.log(error);
        res.status(500).send({"msg": error.error });
    }
}

export const listarEspecialidades = async( req, res )=>{
    try{
        const { id } = req.query;
        let query = "SELECT * FROM especialidades AS e WHERE e.activo = 1";
        const [results, fields] = await Database.query( query );

        if ( !results ) res.status(404);
        res.send(results);
    }catch(error){
        console.log(error);
        res.status(500).send({"msg": error.error });
    }
}

export const crearEspecialidad = async( req, res )=>{
    try{

        const body = req.body;
        const { nombre, activo } = req.body;
        const query = "INSERT INTO especialidades ( nombre, activo ) VALUES ( ?, ?)"

        const [ response, fields ] = await Database.query( query, [ nombre, activo ] )

        res.status(201).send({"msg":"Especialidad creada correctamente"})

    }catch(error){
        console.log(error);
        res.status(500).send({"msg": "error.Error" });
    }
}

export const activarEspecialidad =  async( req, res )=>{
    try{
        const { id } = req.params;
        let query = "UPDATE especialidades SET activo = 1 WHERE id_especialidad = ? ";
        const [results, fields] = await Database.query( query, id );
        console.log(results, fields)
        res.send({ "msg": "Especialidad activada" });
    }catch(error){
        console.log(error);
        res.status(500).send({"msg": error.error });
    }
}

export const desactivarEspecialidad =  async( req, res )=>{
    try{
        const { id } = req.params;
        let query = "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ? ";
        const [results, fields] = await Database.query( query, id );
        console.log(results, fields)
        res.send({ "msg": "Especialidad desactivada" });
    }catch(error){
        console.log(error);
        res.status(500).send({"msg": error.error });
    }
}