import { Router } from "express";
import { param, check, query } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { TurnosReservasController } from "../../controllers/turnos_reservas.controller.js";

export const TurnosRoutes = Router();

const turnosController = new TurnosReservasController();

// ToDo para agregar middleware de autenticación JWT
// ToDo para agregar middleware de autorización por roles (Médico=1, Paciente=2, Admin=3)

TurnosRoutes.get("/",
  [
    query('medico').optional().isNumeric().withMessage('El id de médico debe ser numérico'),
    query('paciente').optional().isNumeric().withMessage('El id de paciente debe ser numérico'),
    validarCampos
  ],
  turnosController.listarTodos
);

TurnosRoutes.get("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  turnosController.buscarPorId
);

TurnosRoutes.post("/",
  [
    check('id_medico').notEmpty().withMessage('El id de médico es obligatorio').isNumeric().withMessage('El id de médico debe ser numérico'),
    check('id_paciente').notEmpty().withMessage('El id de paciente es obligatorio').isNumeric().withMessage('El id de paciente debe ser numérico'),
    check('id_obra_social').notEmpty().withMessage('El id de obra social es obligatorio').isNumeric().withMessage('El id de obra social debe ser numérico'),
    check('fecha_hora').notEmpty().withMessage('La fecha y hora son obligatorias').isISO8601().withMessage('La fecha debe tener formato válido (ej: 2026-04-01T17:00:00)'),
    validarCampos
  ],
  turnosController.crear
);

//marcar turno como atendido médico/admin
TurnosRoutes.patch("/:id/atender",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  turnosController.marcarAtendido
);

TurnosRoutes.delete("/:id",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  turnosController.eliminar
);

//restaurar turno soft delete
TurnosRoutes.patch("/:id/restaurar",
  [
    param('id').isNumeric().withMessage('El id debe ser numérico'),
    validarCampos
  ],
  turnosController.restaurar
);
