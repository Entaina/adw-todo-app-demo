---
description: Restart the full application (stop and start all services)
allowed-tools: Bash, Read, Skill
---

# Reiniciar la Aplicación

## Purpose

Reinicia todos los servicios de desarrollo ejecutando un ciclo completo de parada y arranque.
Delega en los comandos `/env:stop` y `/env:start`. Los argumentos se pasan al comando `/env:stop`.

## Variables

STOP_ARGUMENTS: `$ARGUMENTS` — se pasan íntegros al comando `/env:stop` (ej: `--infra`)

## Instructions

- Si la ejecución del comando `/env:stop` falla, detenerse e informar al usuario — no continuar
  con `/env:start`

## Workflow

1. Leer y ejecutar el comando `/env:stop` pasando STOP_ARGUMENTS
2. Leer y ejecutar el comando `/env:start`
