import { Router } from "express";
import { Database } from "../database/conexion.js";

export const especialidadesRoutes = Router();

especialidadesRoutes.get('/:id', async( req, res )=>{
    try{
        const { id } = req.params;
        let query = "SELECT * FROM especialidades AS e WHERE e.activo = 1 AND e.id_especialidad = ? ";
        const [results, fields] = await Database.query( query, id );

        if ( !results ) res.status(404);
        res.send(results);
    }catch(error){
        console.log(error);
        res.status(500).send({"msg": error.error });
    }
})

especialidadesRoutes.get('/', async( req, res )=>{
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
})