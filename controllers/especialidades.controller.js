import { Database } from "../database/conexion.js";
import { editarEspecialidadService } from "../services/especialidades.service.js";

export const buscarEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    let query =
      "SELECT * FROM especialidades AS e WHERE e.activo = 1 AND e.id_especialidad = ? ";
    const [results, fields] = await Database.query(query, [id]);

    if (results.length == 0) res.status(404);
    res.send(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: error.error });
  }
};

export const listarEspecialidades = async (req, res) => {
  try {
    const { id } = req.query;
    let query = "SELECT * FROM especialidades AS e WHERE e.activo = 1";
    const [results, fields] = await Database.query(query);

    if (!results) res.status(404);
    res.send(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: error.error });
  }
};

export const crearEspecialidad = async (req, res) => {
  try {
    const body = req.body;
    const { nombre, activo } = req.body;
    const query =
      "INSERT INTO especialidades ( nombre, activo ) VALUES ( ?, ?)";

    const [response, fields] = await Database.query(query, [nombre, activo]);

    res.status(201).send({ msg: "Especialidad creada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "error.Error" });
  }
};

export const editarEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, activo } = req.body;
    const results = await editarEspecialidadService(id, nombre, activo);

    if (results.affectedRows === 0)
      return res.status(404).send({ msg: "Especialidad no encontrada" });
    res.send({
      msg: "Especialidad editada correctamente",
      data: { id: parseInt(id), nombre, activo },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: error.message });
  }
};

export const eliminarEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
            UPDATE especialidades
            SET activo = 0
            WHERE id_especialidad = ?
        `;

    const [results] = await Database.query(query, [id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Especialidad no encontrada",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Especialidad eliminada",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

export const restaurarEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
            UPDATE especialidades
            SET activo = 1
            WHERE id_especialidad = ?
        `;

    const [results] = await Database.query(query, [id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Especialidad no encontrada",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Especialidad restaurada correctamente",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};
