# Tarea 001: Backend Base Setup - Rails API

## Metadata
task_id: `001`
feature_id: `2026-02-06-073443-todo-list-rails-react`
requisito: `RF-08, RNF-04, RNF-06`
created_at: `2026-02-06T09:00:00Z`
status: `defined`
priority: `1`

## Análisis de Conflictos

### Tareas Relacionadas
No hay tareas existentes en otros features.

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| N/A | Creación backend/ | Ninguna | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: ninguna
- **Bloquea a**: 002, 003, 004, 005, 006

## Historia de Usuario
**Como** facilitador del curso
**Quiero** una aplicación Rails en modo API configurada
**Para** tener la base del backend donde se construirán los endpoints y modelos

## Criterios de Aceptación
- [ ] Existe carpeta `backend/` con una aplicación Rails 7.1+ en modo API
- [ ] La aplicación arranca exitosamente con `rails s` en puerto 3000
- [ ] CORS está configurado en `config/initializers/cors.rb` para permitir localhost:5173
- [ ] El archivo `Gemfile` incluye `rack-cors` y `minitest`
- [ ] El README documenta cómo iniciar el servidor

## Escenarios

### Escenario 1: Arrancar servidor de desarrollo
- **Dado** que tengo Ruby 3.2+ instalado
- **Cuando** ejecuto `cd backend && bundle install && rails s`
- **Entonces** el servidor arranca en http://localhost:3000

### Escenario 2: Verificar configuración CORS
- **Dado** que el servidor está corriendo
- **Cuando** hago un request desde localhost:5173
- **Entonces** los headers CORS permiten la conexión

## Notas
Esta es la tarea base del feature. Todas las demás tareas dependen de tener el backend configurado. No incluye modelos ni endpoints todavía, solo la estructura base de Rails API.
