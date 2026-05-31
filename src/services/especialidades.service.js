import { EspecialidadesModel } from "../database/especialidades.js";

export class EspecialidadesService {
  constructor() {
    this.especialidadesModel = new EspecialidadesModel();
  }

  listarTodas = async (inactivos = false) => {
    return await this.especialidadesModel.listarTodas(inactivos);
  };

  buscar = async (id) => {
    return await this.especialidadesModel.buscar(id);
  };

  editar = async (id, nombre, activo) => {
    return await this.especialidadesModel.editar(id, nombre, activo);
  };

  crear = async (nombre) => {
    return await this.especialidadesModel.crear(nombre);
  };

  eliminar = async (id) => {
    return await this.especialidadesModel.eliminar(id);
  };

  restaurar = async (id) => {
    return await this.especialidadesModel.restaurar(id);
  };
}