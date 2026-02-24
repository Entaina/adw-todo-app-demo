---
description: Stop the full application (backend, frontend, and optionally infrastructure)
allowed-tools: Bash, Read, Skill
---

# Detener la Aplicación

## Purpose

Detiene los servidores de desarrollo del proyecto (backend y frontend). Opcionalmente detiene también la infraestructura si se pasa el argumento `--infra`. Usa este comando cuando quieras parar la aplicación sin cerrar los servicios de base de datos.

## Variables

STOP_INFRA: `true` si `$ARGUMENTS` contiene `--infra` o `-i`; `false` en caso contrario
BACKEND_PID_FILE: `backend/tmp/pids/server.pid`
FRONTEND_PID_FILE: `frontend/tmp/pids/vite.pid`
BACKEND_SOCKETS_DIR: `backend/tmp/sockets/`

## Instructions

- Usa BACKEND_PID_FILE y FRONTEND_PID_FILE para localizar los procesos a detener
- Si un servicio no está corriendo, informa al usuario pero no lo trates como error
- Limpia ficheros residuales (PID files, sockets en BACKEND_SOCKETS_DIR) tras detener

## Workflow

1. Detener el servidor frontend:
   - Verificar si existe FRONTEND_PID_FILE
   <if exists>
   - Leer el PID del fichero
   - Verificar que el proceso existe (`kill -0 <PID>`)
   - Enviar SIGTERM al proceso
   - Esperar hasta 5 segundos a que se detenga
   <if process still running>
   - Enviar SIGKILL
   </if>
   - Eliminar FRONTEND_PID_FILE si sigue existiendo
   </if>
   <else>
   - Informar al usuario de que el frontend no parece estar corriendo
   </else>

2. Detener el servidor backend:
   - Verificar si existe BACKEND_PID_FILE
   <if exists>
   - Leer el PID del fichero
   - Verificar que el proceso existe (`kill -0 <PID>`)
   - Enviar SIGTERM al proceso
   - Esperar hasta 5 segundos a que se detenga
   <if process still running>
   - Enviar SIGKILL
   </if>
   - Eliminar BACKEND_PID_FILE si sigue existiendo
   </if>
   <else>
   - Informar al usuario de que el backend no parece estar corriendo
   </else>
   - Limpiar ficheros en BACKEND_SOCKETS_DIR si los hay

3. <if STOP_INFRA="true">
   Leer y ejecutar el comando `/infra:down`
   </if>

4. Confirmar al usuario qué servicios se han detenido
