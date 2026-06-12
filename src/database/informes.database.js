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
}
