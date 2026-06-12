# Commit 4 — Swagger: Turnos

## Context
Documentar el módulo de turnos. Todos los endpoints requieren JWT Bearer. El comportamiento de GET varía por rol (médico y paciente ven solo los propios; admin puede filtrar).

## Archivos a modificar
- `src/routes/v1/turnos.routes.js`

## Endpoints a documentar

| Método | Path | Roles | Notas |
|--------|------|-------|-------|
| GET | `/turnos` | 1,2,3 | query: `medico` (int, opcional), `paciente` (int, opcional); roles 1 y 2 filtran automáticamente |
| GET | `/turnos/{id}` | 1,2,3 | roles 1 y 2 solo ven el propio |
| POST | `/turnos` | 2,3 | body: `{id_medico, id_paciente, id_obra_social, fecha_hora}` |
| PATCH | `/turnos/{id}/atender` | 1,3 | marcar como atendido |
| DELETE | `/turnos/{id}` | 1,2,3 | soft delete |
| PATCH | `/turnos/{id}/restaurar` | 3 | restaurar turno eliminado |

## Campo fecha_hora
```yaml
fecha_hora:
  type: string
  format: date-time
  example: "2026-04-01T17:00:00"
```

## Schema a reusar
`$ref: '#/components/schemas/Turno'` (definido en commit 1)

## Notas de documentación
- Aclarar en description del GET que roles 1 (médico) y 2 (paciente) reciben solo sus propios turnos, ignorando los query params de filtrado.

## Verificación
Tag "Turnos" con 6 endpoints en `/api/v1/docs`. Probar POST desde la UI con un token válido.
