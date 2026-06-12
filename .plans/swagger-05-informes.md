# Commit 5 — Swagger: Informes

## Context
Documentar el módulo de informes. Los endpoints retornan PDF binario (generado con Puppeteer/Handlebars). Actualmente no requieren autenticación (comentada en las rutas).

## Archivos a modificar
- `src/routes/v1/informes.routes.js`

## Endpoints a documentar

| Método | Path | Query params requeridos | Response |
|--------|------|------------------------|---------|
| GET | `/informes/total_os_anterior` | — | PDF (mes anterior, por obra social) |
| GET | `/informes/total_es_anterior` | — | PDF (mes anterior, por especialidad) |
| GET | `/informes/turnos_completados` | `mes` (1-12), `anio` (2000-2100) | PDF de turnos completados |
| GET | `/informes/turnos_medico` | `id_medico` (int≥1), `mes`, `anio` | PDF de turnos del médico |

## Response schema para PDF
```yaml
responses:
  200:
    description: Reporte en PDF
    content:
      application/pdf:
        schema:
          type: string
          format: binary
```

## Query params con validación
```yaml
parameters:
  - in: query
    name: mes
    required: true
    schema:
      type: integer
      minimum: 1
      maximum: 12
  - in: query
    name: anio
    required: true
    schema:
      type: integer
      minimum: 2000
      maximum: 2100
```

## Verificación
Tag "Informes" con 4 endpoints en `/api/v1/docs`. Ejecutar GET `/informes/total_os_anterior` desde la UI y confirmar que descarga un PDF.
