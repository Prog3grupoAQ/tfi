import express from "express";
import fs from "fs"
import { EspecialidadesRoutes } from "./routes/v1/especialidadesV1.routes.js";
import { MedicosRoutes } from "./routes/v1/medicosV1.routes.js";
import { ObrasSocialesRoutes } from "./routes/v1/obrasSocialesV1.routes.js";
import { PacientesRoutes } from "./routes/v1/pacientesV1.routes.js";
import morgan from "morgan";


export class Server {
  constructor() {
    this.app = express();

    this.middlewares();
    this.logs();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
  }

  logs(){
    const log = fs.createWriteStream(
      './accesos.log',  
      { flags: 'a' }
    );
    this.app.use(morgan('tiny'))
    this.app.use(morgan('combined', {stream: log} ))
  }

  routes() {
    this.app.use("/api/v1/especialidades", EspecialidadesRoutes);
    this.app.use("/api/v1/medicos", MedicosRoutes);
    this.app.use("/api/v1/obras_sociales", ObrasSocialesRoutes);
    this.app.use("/api/v1/pacientes", PacientesRoutes);
  }

  listen() {
    const port = process.env.PORT || 3003;

    this.app.listen(port, () => {
      console.log(`Server corriendo en puerto ${port}`);
    });
  }
}
