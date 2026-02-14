---
description: Start the full development environment (PostgreSQL, Rails API, React frontend)
allowed-tools: Bash, Skill
---

# Inicia el Proyecto

## Purpose

Arranca todos los servicios necesarios para el entorno de desarrollo: PostgreSQL, backend Rails API y frontend React. Usa este comando cuando quieras levantar el proyecto desde cero o después de un reinicio.

## Workflow

1. Ejecutar el comando `/setup` para instalar dependencias y preparar el entorno (Docker, base de datos, dependencias)
   - Si `/setup` falla, detenerse e informar al usuario
2. Iniciar los servidores de desarrollo:
   - Iniciar Rails API en background: `bin/dev` en `backend/` (puerto 3000)
   - Iniciar Vite dev server en background: `npm run dev` en `frontend/` (puerto 5173)
3. Confirmar que ambos servicios están respondiendo e informar al usuario las URLs:
   - Backend: http://localhost:3000
   - Frontend: http://localhost:5173

## Instructions

- Usa `run_in_background: true` en Bash para los servidores (Rails y Vite) para que ambos corran simultáneamente
- Si algún puerto (3000 o 5173) ya está en uso, informa al usuario en lugar de intentar matar el proceso
