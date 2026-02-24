---
description: Stop infrastructure services (PostgreSQL), optionally deleting volumes
allowed-tools: Bash
---

# Detener Infraestructura

## Purpose

Detiene los servicios de infraestructura del proyecto. Opcionalmente elimina los volúmenes de datos si se pasa el argumento `-v`.

## Variables

DELETE_VOLUMES: `true` si `$ARGUMENTS` contiene `-v`, `--volumes` o `volumes`; `false` en caso contrario

## Instructions

- Todos los comandos `docker compose` deben ejecutarse desde el directorio `backend/`
- Si Docker no está corriendo o el comando falla, informar al usuario y detenerse

## Workflow

1. Determinar el valor de DELETE_VOLUMES según la sección Variables
2. Detener los servicios:
   <if DELETE_VOLUMES="true">
   Ejecutar `docker compose down -v` desde `backend/`
   </if>
   <else>
   Ejecutar `docker compose down` desde `backend/`
   </else>
3. Confirmar al usuario que los servicios se han detenido, indicando si los volúmenes fueron eliminados o conservados
