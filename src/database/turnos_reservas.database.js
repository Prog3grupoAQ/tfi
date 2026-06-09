import { Database } from "./conexion.js";

export class TurnosReservasDatabase {
  #baseQuery = `
    SELECT 
      tr.id_turno_reserva,
      tr.id_medico,
      tr.id_paciente,
      tr.id_obra_social,
      tr.fecha_hora,
      tr.valor_total,
      tr.atendido,
      tr.activo,
      um.apellido AS medico_apellido,
      um.nombres AS medico_nombres,
      m.matricula AS medico_matricula,
      e.nombre AS especialidad,
      up.apellido AS paciente_apellido,
      up.nombres AS paciente_nombres,
      os.nombre AS obra_social
    FROM turnos_reservas AS tr
    INNER JOIN medicos AS m ON tr.id_medico = m.id_medico
    INNER JOIN usuarios AS um ON m.id_usuario = um.id_usuario
    INNER JOIN especialidades AS e ON m.id_especialidad = e.id_especialidad
    INNER JOIN pacientes AS p ON tr.id_paciente = p.id_paciente
    INNER JOIN usuarios AS up ON p.id_usuario = up.id_usuario
    INNER JOIN obras_sociales AS os ON tr.id_obra_social = os.id_obra_social`;

  listarTodos = async (filtros = {}) => {
    const params = [];
    let query = this.#baseQuery + ` WHERE tr.activo = 1`;

    if (filtros.id_medico) {
      query += ` AND tr.id_medico = ?`;
      params.push(filtros.id_medico);
    }

    if (filtros.id_paciente) {
      query += ` AND tr.id_paciente = ?`;
      params.push(filtros.id_paciente);
    }

    query += ` ORDER BY tr.fecha_hora DESC`;

    const [results] = await Database.query(query, params);
    return results;
  };

  buscarPorId = async (id) => {
    const query = this.#baseQuery + ` WHERE tr.id_turno_reserva = ? AND tr.activo = 1`;
    const [results] = await Database.query(query, [id]);
    return results;
  };

  // utiliza transacción MySQL para validar FKs y calcular valor_total
  crear = async (turno) => {
    const { id_medico, id_paciente, id_obra_social, fecha_hora } = turno;
    const connection = await Database.getConnection();

    try {
      await connection.beginTransaction();
      //validamos que medico y paciente existan y esten activos
      const [medicos] = await connection.query(
        `SELECT m.valor_consulta 
         FROM medicos AS m 
         INNER JOIN usuarios AS u ON m.id_usuario = u.id_usuario 
         WHERE m.id_medico = ? AND u.activo = 1`,
        [id_medico]
      );
      if (medicos.length === 0) {
        throw { tipo: "MEDICO_NO_ENCONTRADO" };
      }

      const [pacientes] = await connection.query(
        `SELECT p.id_paciente 
         FROM pacientes AS p 
         INNER JOIN usuarios AS u ON p.id_usuario = u.id_usuario 
         WHERE p.id_paciente = ? AND u.activo = 1`,
        [id_paciente]
      );
      if (pacientes.length === 0) {
        throw { tipo: "PACIENTE_NO_ENCONTRADO" };
      }

      //validamos que la obra social exista y esté activa
      const [obrasSociales] = await connection.query(
        `SELECT porcentaje_descuento, es_particular 
         FROM obras_sociales 
         WHERE id_obra_social = ? AND activo = 1`,
        [id_obra_social]
      );
      if (obrasSociales.length === 0) {
        throw { tipo: "OBRA_SOCIAL_NO_ENCONTRADA" };
      }

      //calculamos valor_total según regla de negocio
      const valor_consulta = Number(medicos[0].valor_consulta);
      const { porcentaje_descuento, es_particular } = obrasSociales[0];
      
      //relacion medicoObraSocial
      if (!es_particular) {
        const [relacion] = await connection.query(
          `SELECT 1 
           FROM medicos_obras_sociales 
           WHERE id_medico = ? AND id_obra_social = ? AND activo = 1`,
          [id_medico, id_obra_social]
        );
        if (relacion.length === 0) {
          throw { tipo: "MEDICO_NO_TRABAJA_CON_OBRA_SOCIAL" };
        }
      }

      const valor_total = es_particular
        ? valor_consulta
        : valor_consulta - (Number(porcentaje_descuento) * valor_consulta);

      // insertar turno
      const [result] = await connection.query(
        `INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atendido) 
         VALUES (?, ?, ?, ?, ?, 0)`,
        [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total]
      );

      await connection.commit();

      if (result.affectedRows === 0) return null;
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };

  marcarAtendido = async (id) => {
    const query = `UPDATE turnos_reservas SET atendido = 1 
      WHERE id_turno_reserva = ? AND activo = 1 AND atendido = 0`;
    const [result] = await Database.query(query, [id]);
    return result;
  };

  eliminar = async (id) => {
    const query = "UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ? AND activo = 1";
    const [result] = await Database.query(query, [id]);
    return result;
  };

  restaurar = async (id) => {
    const query = "UPDATE turnos_reservas SET activo = 1 WHERE id_turno_reserva = ? AND activo = 0";
    const [result] = await Database.query(query, [id]);
    return result;
  };
}
