---
description: Encuentra la ruta del fichero de plan creado en plans/
allowed-tools:
  - Bash
---

# Encontrar Fichero de Plan

Encuentra la ruta exacta del fichero de plan .md creado en plans/.

## Variables

REFERENCIA: $ARGUMENTS - Texto de referencia para identificar el fichero de plan

## Instrucciones

- Encuentra la ruta del fichero .md creado en el directorio plans/.
- Estrategia de busqueda (en orden de prioridad):
  1. Busca en REFERENCIA una ruta que coincida con el patron `plans/*.md`.
  2. Si no la encuentras, ejecuta `git status --short plans/` para ver ficheros nuevos.
  3. Como ultimo recurso, ejecuta `ls -t plans/*.md | head -1` para obtener el fichero mas reciente.
- Valida que el fichero existe ejecutando `test -f <ruta>`.
- Responde EXCLUSIVAMENTE con la ruta del fichero (ej: plans/fix-login-error.md) o `none` si no lo encuentras.
- NO incluyas explicaciones, comillas, backticks ni texto adicional.

## Reporte

Responde con un unico valor: la ruta del fichero (ej: plans/fix-login-error.md) o `none`.
