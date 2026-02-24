---
description: Crea un pull request con contexto completo de la issue y el plan
allowed-tools:
  - Bash
---

# Crear Pull Request

Crea un pull request en Github con el contexto de la issue, el plan y los cambios realizados.

## Variables

BRANCH_NAME: $1 - Nombre de la rama actual
ISSUE: $2 - JSON de la issue de Github
PLAN_FILE: $3 - Ruta al fichero del plan de implementacion
ADW_ID: $4 - Identificador del workflow ADW

## Instrucciones

- Extrae el numero de issue, tipo y titulo del JSON de ISSUE.
- Genera el titulo del PR con el formato: `<issue_type>: #<issue_number> - <issue_title>`
  - Ejemplos: `feat: #123 - Add user authentication`, `bug: #456 - Fix login validation error`
- Genera el cuerpo del PR usando el `Formato del PR`.
- IMPORTANTE: Usa `--body-file` con un fichero temporal para evitar problemas de escape en el cuerpo del PR.

## Formato del PR

```
## Summary
<resumen breve del contexto de la issue y los cambios realizados>

Closes #<issue_number>

## Implementation Plan
See [plan file](<PLAN_FILE>)

## Changes
<lista con vinetas de los cambios clave realizados>

## ADW
ADW ID: <ADW_ID>
```

## Workflow

### Paso 1: Analizar cambios
- Ejecuta `git diff origin/main...HEAD --stat` para ver resumen de ficheros cambiados.
- Ejecuta `git log origin/main..HEAD --oneline` para ver los commits incluidos.

### Paso 2: Publicar rama
- Ejecuta `git push -u origin BRANCH_NAME` para publicar la rama.

### Paso 3: Crear pull request
- Genera el titulo y cuerpo del PR segun las instrucciones y el `Formato del PR`.
- Escribe el cuerpo del PR en un fichero temporal: `/tmp/pr_body.md`.
- Ejecuta `gh pr create --title "<pr_title>" --body-file /tmp/pr_body.md --base main --head BRANCH_NAME`.
- Captura la URL del PR de la salida.
- Elimina el fichero temporal.

## Reporte

Responde EXCLUSIVAMENTE con la URL del pull request creado (sin texto adicional).
