import passport from "./config/passport.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import fs from "fs"
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.js";
import { EspecialidadesRoutes } from "./routes/v1/especialidadesV1.routes.js";
import { ObrasSocialesRoutes } from "./routes/v1/obrasSocialesV1.routes.js";
import { autenticarUsuario } from "./middlewares/autenticarUsuario.js";
import { PacientesRoutes } from "./routes/v1/pacientesV1.routes.js";
import { RegistroRoutes } from "./routes/v1/registroV1.routes.js";
import { MedicosRoutes } from "./routes/v1/medicosV1.routes.js";
import { TurnosRoutes } from "./routes/v1/turnosV1.routes.js";
import { AuthRoutes } from "./routes/v1/authV1.routes.js";
import { InformesRoutes } from "./routes/v1/informesV1.routes.js";



export class Server {
  constructor() {
    this.app = express();

    this.middlewares();
    this.logs();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use("/uploads", express.static("uploads"));
    this.app.use(passport.initialize());
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
    this.app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(specs));

    // Estas van aun auth
    this.app.use("/api/v1/auth", AuthRoutes);
    this.app.use("/api/v1/registro", RegistroRoutes);

    // Estas requieren estar autenticado
    this.app.use("/api/v1/especialidades", autenticarUsuario, EspecialidadesRoutes);
    this.app.use("/api/v1/medicos",        autenticarUsuario, MedicosRoutes);
    this.app.use("/api/v1/obras_sociales", autenticarUsuario, ObrasSocialesRoutes);
    this.app.use("/api/v1/pacientes",      autenticarUsuario, PacientesRoutes);
    this.app.use("/api/v1/turnos",         autenticarUsuario, TurnosRoutes);
    this.app.use("/api/v1/informes",       InformesRoutes);
  }

  listen() {
    const port = process.env.PORT || 3003;

    this.app.listen(port, () => {
      console.log(`Server corriendo en puerto ${port}`);
    });
  }
}
