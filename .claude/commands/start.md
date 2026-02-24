---
description: Start the full development environment (infrastructure, backend, frontend)
allowed-tools: Bash, Read
---

# Inicia el Proyecto

## Purpose

Arranca todos los servicios necesarios para el entorno de desarrollo: infraestructura, backend y frontend. Usa este comando cuando quieras levantar el proyecto desde cero o después de un reinicio.

## Instructions

- Usa `run_in_background: true` en Bash para los servidores para que corran simultáneamente
- Si algún puerto ya está en uso, informa al usuario en lugar de intentar matar el proceso

## Workflow

1. Ejecutar el comando `/setup` para instalar dependencias y preparar el entorno
   <if fails>
   Detenerse e informar al usuario. No continuar con los pasos siguientes.
   </if>

2. Iniciar los servidores de desarrollo:
   - Iniciar backend en background: `bin/dev` en `backend/`
   - Iniciar frontend en background: `bin/dev` en `frontend/`

3. Confirmar que ambos servicios están respondiendo e informar al usuario las URLs
