import { Database } from "./conexion.js";

export class ObrasSocialesDatabase {
  listarTodas = async (inactivos = false) => {
    const where = !inactivos ? "WHERE activo = 1" : "";
    const query = `SELECT * FROM obras_sociales ${where}`;
    const [results] = await Database.query(query);
    return results;
  };

  buscarPorId = async (id) => {
    const query = "SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1";
    const [results] = await Database.query(query, [id]);
    return results;
  };

  buscarPorNombre = async (nombre, excluirId = null) => {
    const consulta = excluirId
      ? "SELECT * FROM obras_sociales WHERE nombre = ? AND id_obra_social != ? AND activo = 1"
      : "SELECT * FROM obras_sociales WHERE nombre = ? AND activo = 1";
    const parametros = excluirId ? [nombre, excluirId] : [nombre];
    const [resultados] = await Database.query(consulta, parametros);
    return resultados;
  };

  crear = async (obraSocial) => {
    const { nombre, descripcion, porcentaje_descuento, es_particular } = obraSocial;
    const query = "INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular) VALUES (?, ?, ?, ?)";
    const [result] = await Database.query(query, [nombre, descripcion, porcentaje_descuento ?? 0, es_particular ?? 0]);
    if (result.affectedRows === 0) return null;
    return result.insertId;
  };

  editar = async (id, obraSocial) => {
    const { nombre, descripcion, porcentaje_descuento, es_particular } = obraSocial;
    const query = "UPDATE obras_sociales SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ? AND activo = 1";
    const [result] = await Database.query(query, [nombre, descripcion, porcentaje_descuento ?? 0, es_particular ?? 0, id]);
    return result;
  };

  eliminar = async (id) => {
    const query = "UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ? AND activo = 1";
    const [result] = await Database.query(query, [id]);
    return result;
  };

  restaurar = async (id) => {
    const query = "UPDATE obras_sociales SET activo = 1 WHERE id_obra_social = ? AND activo = 0";
    const [result] = await Database.query(query, [id]);
    return result;
  };
}
