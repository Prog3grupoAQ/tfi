import express from "express"
import { userRoutes } from "../routes/user.routes.js";
import { especialidadesRoutes } from "../routes/especialidades.routes.js";

export class Server {

    constructor(){
        this.app = express();
        this.routes();
    }

    routes(){
        this.app.use( "/especialidades", especialidadesRoutes )
        this.app.use( "/", userRoutes )
    }

    listen(){
        const port = process.env.PORT || 3003;

        this.app.listen( port , ()=>{
            console.log(`Server corriendo en puerto ${port}`)
        })

    }
   
}

