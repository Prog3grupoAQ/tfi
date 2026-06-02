import { ObrasSocialesService } from "../services/obras_sociales.service.js";

export class ObrasSocialesController {
  constructor() {
    this.obrasSociales = new ObrasSocialesService();
  }

  listarTodas = async (req, res) => {
    try {
      const inactivos = req.query.inactivos === "true";
      const resultado = await this.obrasSociales.listarTodas(inactivos);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "No se encontraron obras sociales" });

      return res.json({ estado: true, data: resultado });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.obrasSociales.buscarPorId(id);

      if (!resultado || resultado.length === 0)
        return res.status(404).json({ estado: false, msg: "Obra social no encontrada" });

      return res.json({ estado: true, data: resultado[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  crear = async (req, res) => {
    try {
      const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;
      const nuevaObraSocial = await this.obrasSociales.crear({ nombre, descripcion, porcentaje_descuento, es_particular });

      if (!nuevaObraSocial || nuevaObraSocial.length === 0)
        return res.status(400).json({ estado: false, msg: "No se pudo crear la obra social." });

      return res.status(201).json({ estado: true, msg: "Obra social creada correctamente", data: nuevaObraSocial[0] });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY")
        return res.status(409).json({ estado: false, msg: "Ya existe una obra social con ese nombre" });
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;
      const resultado = await this.obrasSociales.editar(id, { nombre, descripcion, porcentaje_descuento, es_particular });

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Obra social no encontrada o inactiva" });

      const msg = resultado.changed
        ? "Obra social editada correctamente"
        : "Sin cambios (los datos enviados son idénticos a los actuales)";

      return res.status(200).json({ estado: true, msg, data: resultado.data[0] });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY")
        return res.status(409).json({ estado: false, msg: "Ya existe una obra social con ese nombre" });
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.obrasSociales.eliminar(id);

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Obra social no encontrada o ya eliminada" });

      return res.status(200).json({ estado: true, msg: "Obra social eliminada" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };

  restaurar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.obrasSociales.restaurar(id);

      if (!resultado)
        return res.status(404).json({ estado: false, msg: "Obra social no encontrada o ya activa" });

      return res.status(200).json({ estado: true, msg: "Obra social restaurada correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ estado: false, msg: "Error interno del servidor" });
    }
  };
}
