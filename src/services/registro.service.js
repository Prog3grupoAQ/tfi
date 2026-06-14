import { UsuariosDatabase } from "../database/usuarios.database.js";
import { MedicosDatabase } from "../database/medicos.database.js";
import { PacientesDatabase } from "../database/pacientes.database.js";
import { RegistroDatabase } from "../database/registro.database.js";

export class RegistroService {
  constructor() {
    this.usuariosDB = new UsuariosDatabase();
    this.medicosDB = new MedicosDatabase();
    this.pacientesDB = new PacientesDatabase();
    this.registroDB = new RegistroDatabase();
  }

  registrarMedico = async (datosUsuario, datosMedico) => {
    const duplicados = await this.usuariosDB.buscarPorDocumentoOEmail(
      datosUsuario.documento, datosUsuario.email
    );
    if (duplicados.length > 0) return { duplicadoUsuario: true };

    const medicoExistente = await this.medicosDB.buscarPorMatricula(datosMedico.matricula);
    if (medicoExistente.length > 0) return { duplicadoMedico: true };

    const { id_medico } = await this.registroDB.crearMedico(datosUsuario, datosMedico);
    return await this.medicosDB.buscarPorId(id_medico);
  };

  registrarPaciente = async (datosUsuario, datosPaciente) => {
    const duplicados = await this.usuariosDB.buscarPorDocumentoOEmail(
      datosUsuario.documento, datosUsuario.email
    );
    if (duplicados.length > 0) return { duplicadoUsuario: true };

    const { id_paciente } = await this.registroDB.crearPaciente(datosUsuario, datosPaciente);
    return await this.pacientesDB.buscarPorId(id_paciente);
  };
}
