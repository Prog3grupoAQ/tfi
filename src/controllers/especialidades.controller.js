import { EspecialidadesService } from "../services/especialidades.service.js";

export class EspecialidadesController{

  constructor(){
    this.especialidades = new EspecialidadesService()
  }

  listarTodas = async (req, res) => {
    try {
      const inactivos = req.query.inactivos === "true";
      const resultado = await this.especialidades.listarTodas(inactivos);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "No se encontraron especialidades" });

      return res.json({ estado: true, data: resultado });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  buscar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.especialidades.buscar(id);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "Especialidad no encontrada" });

      return res.json({ estado: true, data: resultado[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, activo } = req.body;
      const results = await this.especialidades.editar(id, nombre, activo);

      if (results.affectedRows === 0)
        return res.status(404).json({ estado: false, msg: "Especialidad no encontrada o inactiva" });

      if (results.changedRows === 0)
        return res.status(200).json({
          estado: true,
          msg: "Sin cambios (los datos enviados son idénticos a los actuales)",
          data: { id: parseInt(id), nombre, activo },
        });

      return res.status(200).json({
        estado: true,
        msg: "Especialidad editada correctamente",
        data: { id: parseInt(id), nombre, activo },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY")
        return res.status(409).json({ estado: false, msg: "Ya existe una especialidad con ese nombre" });
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  crear = async (req, res) => {
    try {
      const { nombre, activo = 1 } = req.body;
      const response = await this.especialidades.crear(nombre, activo);

      return res.status(201).json({
        estado: true,
        msg: "Especialidad creada correctamente",
        data: { id: response.insertId, nombre, activo },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY")
        return res.status(409).json({ estado: false, msg: "Ya existe una especialidad con ese nombre" });
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      const results = await this.especialidades.eliminar(id);

      if (results.affectedRows === 0)
        return res.status(404).json({ estado: false, msg: "Especialidad no encontrada o ya eliminada" });

      return res.status(200).json({ estado: true, msg: "Especialidad eliminada" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  restaurar = async (req, res) => {
    try {
      const { id } = req.params;
      const results = await this.especialidades.restaurar(id);

      if (results.affectedRows === 0)
        return res.status(404).json({ estado: false, msg: "Especialidad no encontrada o ya activa" });

      return res.status(200).json({ estado: true, msg: "Especialidad restaurada correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };
}