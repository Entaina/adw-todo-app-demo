---
description: Start infrastructure services (PostgreSQL) using Docker Compose
disable-model-invocation: true
allowed-tools: Bash
---

# Levantar Infraestructura

## Purpose

Inicia los servicios de infraestructura del proyecto utilizando Docker Compose. Usa este comando para arrancar los servicios antes de trabajar con el backend.

## Instructions

- Todos los comandos `docker compose` deben ejecutarse desde el directorio `backend/`
- Si Docker no está corriendo o el comando falla, informar al usuario y detenerse

## Workflow

1. Ejecutar `docker compose up -d` desde el directorio `backend/`
2. Verificar el estado con `docker compose ps` desde `backend/`
3. Informar al usuario de los servicios arrancados y sus respectivos puertos
