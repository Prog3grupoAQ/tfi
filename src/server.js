import express from "express";
import { EspecialidadesRoutes } from "./routes/v1/especialidadesV1.routes.js";


export class Server {
  constructor() {
    this.app = express();

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/api/v1/especialidades", EspecialidadesRoutes);
  }

  listen() {
    const port = process.env.PORT || 3003;

    this.app.listen(port, () => {
      console.log(`Server corriendo en puerto ${port}`);
    });
  }
}
