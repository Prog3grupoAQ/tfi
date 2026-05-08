import { Database } from "../database/conexion.js";
import { EspecialidadesService } from "../services/especialidades.service.js";

export class EspecialidadesController{

  constructor(){
    this.especialidades = new EspecialidadesService()
  }

  listarTodas = async (req, res) => {
    try {
      const resultado = await this.especialidades.listarTodas()

      if (!resultado) res.status(404).json({ estado: false, msg: "No se encontraron especialidades" });
      res.json({ estado: true, data: resultado });
    } catch (error) {
      console.log(error);
      res.status(500).json({ estado: false, msg: "Error interno" });
    }
  }

  buscar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.especialidades.buscar(id);
      if (!resultado) res.status(404).json({ estado: false, msg: "Especialidad no encontrada" });
      res.json({ estado: true, data: resultado });
    } catch (error) {
      console.log(error);
      res.status(500).json({ estado: false, msg: "Error interno" });
    }
  }

  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, activo } = req.body;
      const results = await this.especialidades.editar(id, nombre, activo);

      if (results.affectedRows === 0) res.status(404).json({ estado: false, msg: "Especialidad no encontrada" });
      res.json({
        estado: true,
        msg: "Especialidad editada correctamente",
        data: { id: parseInt(id), nombre, activo },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ estado: false, msg: "Error interno" });
    }
  };

  crear= async (req, res) => {
    try {
      const body = req.body;
      const { nombre, activo } = req.body;
      const response = await this.especialidades.crear(nombre, activo);

      res.status(201).json({ estado: true, msg: "Especialidad creada correctamente", data: { id: response.insertId, nombre, activo } });
    } catch (error) {
      console.log(error);
      res.status(500).json({ estado: false, msg: "Error interno" });
    }
  };

  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      const results = await this.especialidades.eliminar(id);

      if (results.affectedRows === 0) {
        return res.status(404).json({estado: false,msg: "Especialidad no encontrada o ya eliminada",});
      }

      res.status(200).json({estado: true,msg: "Especialidad eliminada",});
    } catch (error) {
      console.log(error);

      res.status(500).json({estado: false,msg: "Error interno"});
    }
  };

  restaurar = async (req, res) => {
    try {
      const { id } = req.params;
      const results = await this.especialidades.restaurar(id);

      if (results.affectedRows === 0) {
        return res.status(404).json({estado: false, msg: "Especialidad no encontrada o activa",});
      }

      res.status(200).json({estado: true,msg: "Especialidad restaurada correctamente",});
    } catch (error) {
      console.log(error);
      res.status(500).json({estado: false,msg: "Error interno"});
    }
  }
}

/*

export const listarEspecialidades

export const buscarEspecialidad

export const crearEspecialidad

export const editarEspecialidad

export const eliminarEspecialidad

export const restaurarEspecialidad
*/