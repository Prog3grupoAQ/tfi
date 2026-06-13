# Commit 6 — Swagger: Obras Sociales + Pacientes (resto)

## Context
Completar la documentación con los dos módulos restantes. Ambos siguen el mismo patrón CRUD con soft delete. Todos los endpoints requieren JWT Bearer.

## Archivos a modificar
- `src/routes/v1/obras_sociales.routes.js`
- `src/routes/v1/pacientes.routes.js`

---

## Obras Sociales

| Método | Path | Roles | Notas |
|--------|------|-------|-------|
| GET | `/obras_sociales` | 1,2,3 | query: `inactivos` (boolean, opcional) |
| GET | `/obras_sociales/{id}` | 1,2,3 | — |
| POST | `/obras_sociales` | 3 | body: `{nombre, descripcion, porcentaje_descuento?, es_particular?}` |
| PUT | `/obras_sociales/{id}` | 3 | body ídem POST |
| DELETE | `/obras_sociales/{id}` | 3 | soft delete |
| PATCH | `/obras_sociales/{id}` | 3 | restaurar |

**Campo porcentaje_descuento:**
```yaml
porcentaje_descuento:
  type: number
  format: float
  minimum: 0
  maximum: 1
  example: 0.20
  description: "Porcentaje en decimal (0.20 = 20%)"
```

---

## Pacientes

| Método | Path | Roles | Notas |
|--------|------|-------|-------|
| GET | `/pacientes` | 1,3 | query: `obra_social` (integer, opcional) |
| GET | `/pacientes/{id}` | 1,2,3 | rol 2 solo ve el propio |
| PUT | `/pacientes/{id}` | 2,3 | body: `{id_obra_social}` |
| DELETE | `/pacientes/{id}` | 3 | soft delete |

---

## Verificación final
1. Tags "Obras Sociales" y "Pacientes" visibles en `/api/v1/docs`
2. Total de endpoints documentados: ~35 (auth + registro + especialidades + médicos + turnos + informes + obras sociales + pacientes)
3. El botón "Authorize" con un token válido permite ejecutar todos los endpoints protegidos desde la UI
4. Sin errores de YAML/spec en la consola del servidor
