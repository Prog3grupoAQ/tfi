# Commit 3 — Swagger: Médicos

## Context
Documentar el módulo de médicos, incluyendo el endpoint de asociación con obras sociales. Todos los endpoints requieren JWT Bearer.

## Archivos a modificar
- `src/routes/v1/medicos.routes.js`

## Endpoints a documentar

| Método | Path | Roles | Notas |
|--------|------|-------|-------|
| GET | `/medicos` | 1,2,3 | query: `especialidad` (integer, opcional) — filtra por ID de especialidad |
| GET | `/medicos/{id}` | 1,2,3 | — |
| PUT | `/medicos/{id}` | 1,3 | body: `{id_especialidad, valor_consulta, descripcion?}` |
| DELETE | `/medicos/{id}` | 3 | soft delete |
| POST | `/medicos/{id_medico}/obras-sociales` | 3 | body: `{obras_sociales: [integer]}` (array, min 1 elemento) |

## Schemas a usar
- Response: `$ref: '#/components/schemas/Medico'`
- Body de obras-sociales:
  ```yaml
  type: object
  required: [obras_sociales]
  properties:
    obras_sociales:
      type: array
      items: { type: integer }
      minItems: 1
  ```

## Verificación
Tag "Médicos" visible en `/api/v1/docs` con los 5 endpoints.
