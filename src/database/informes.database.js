import { Database } from "./conexion.js";

export class InformesDatabase {
  porObrasSociales = async () => {
    const query = "CALL obras_sociales_turnos_mes_anterior()";
    const [rows] = await Database.query(query);
    return Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
  };

  porEspecialidades = async () => {
    const query = "CALL especialidades_turnos_mes_anterior()";
    const [rows] = await Database.query(query);
    return Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
  };

  turnosCompletadosPorMes = async (mes, anio) => {
    const query = "CALL turnos_completados_por_mes(?, ?)";
    const [rows] = await Database.query(query, [mes, anio]);
    return Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
  };

  datosMedico = async (idMedico) => {
    const query = `
      SELECT m.matricula, u.apellido, u.nombres, u.email, u.documento,
             e.nombre AS especialidad, m.valor_consulta
      FROM medicos m
      INNER JOIN usuarios u      ON u.id_usuario      = m.id_usuario
      INNER JOIN especialidades e ON e.id_especialidad = m.id_especialidad
      WHERE m.id_medico = ? AND u.activo = 1`;
    const [rows] = await Database.query(query, [idMedico]);
    return rows[0] ?? null;
  };

  turnosCompletadosPorMedico = async (idMedico, mes, anio) => {
    const query = "CALL turnos_completados_por_medico_mes(?, ?, ?)";
    const [rows] = await Database.query(query, [idMedico, mes, anio]);
    return Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
  };
}
