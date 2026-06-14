import { Database } from "./conexion.js";

export class RegistroDatabase {
  crearMedico = async (datosUsuario, datosMedico) => {
    const { documento, apellido, nombres, email, contrasenia, foto_path } = datosUsuario;
    const { id_especialidad, matricula, descripcion, valor_consulta } = datosMedico;

    const connection = await Database.getConnection();
    try {
      await connection.beginTransaction();

      const [resultadoUsuario] = await connection.query(
        `INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol)
         VALUES (?, ?, ?, ?, SHA2(?, 256), ?, 1)`,
        [documento, apellido, nombres, email, contrasenia, foto_path]
      );
      const id_usuario = resultadoUsuario.insertId;

      const [resultadoMedico] = await connection.query(
        `INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta)
         VALUES (?, ?, ?, ?, ?)`,
        [id_usuario, id_especialidad, matricula, descripcion, valor_consulta]
      );

      await connection.commit();
      return { id_usuario, id_medico: resultadoMedico.insertId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };

  crearPaciente = async (datosUsuario, datosPaciente) => {
    const { documento, apellido, nombres, email, contrasenia, foto_path } = datosUsuario;
    const { id_obra_social } = datosPaciente;

    const connection = await Database.getConnection();
    try {
      await connection.beginTransaction();

      const [resultadoUsuario] = await connection.query(
        `INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol)
         VALUES (?, ?, ?, ?, SHA2(?, 256), ?, 2)`,
        [documento, apellido, nombres, email, contrasenia, foto_path]
      );
      const id_usuario = resultadoUsuario.insertId;

      const [resultadoPaciente] = await connection.query(
        "INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)",
        [id_usuario, id_obra_social]
      );

      await connection.commit();
      return { id_usuario, id_paciente: resultadoPaciente.insertId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
}
