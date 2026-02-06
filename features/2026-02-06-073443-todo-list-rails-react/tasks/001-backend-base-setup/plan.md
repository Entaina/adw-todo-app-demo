# Plan: Backend Base Setup - Rails API

## Metadata
task_path: `features/2026-02-06-073443-todo-list-rails-react/tasks/001-backend-base-setup`
feature_id: `2026-02-06-073443-todo-list-rails-react`
created_at: `2026-02-06T09:15:00Z`
status: `planned`

## Análisis de Código Existente

### Búsqueda Realizada
- Búsqueda de archivos Ruby: No se encontraron archivos `.rb` existentes
- Búsqueda de Gemfile: No se encontró Gemfile existente
- Búsqueda de estructura Rails: No existe estructura Rails previa
- Verificación de entorno: Ruby 3.3.1 y Rails 8.1.1 disponibles

### Matriz de Impacto (OBLIGATORIO)

| Componente | Archivo Existente | Líneas | Impacto |
|------------|-------------------|--------|---------|
| Rails App | N/A | N/A | CREAR |
| CORS Config | N/A | N/A | CREAR |
| Gemfile | N/A | N/A | CREAR |
| Routes | N/A | N/A | CREAR |
| README | N/A | N/A | CREAR |

**Archivos Nuevos Requeridos**: ~50 (estructura completa de Rails API)
**Archivos a Modificar**: 0

### Evaluación de Patrones

Este es un proyecto greenfield. Los patrones a seguir serán:
- **Convenciones Rails 8**: Estructura estándar de aplicación Rails en modo API
- **Naming**: Snake_case para archivos y métodos (convención Ruby)
- **Estructura**: Separación clara backend/ y frontend/ en el mismo repositorio
- **API REST**: Endpoints bajo namespace /api/ para claridad
- **Testing**: Minitest (default de Rails) para tests de integración
- **Configuración**: Initializers para CORS y configuraciones específicas

### Matriz de Conflictos

| Tipo | Recurso | Otra Tarea | Resolución |
|------|---------|------------|------------|
| Dependencia | backend/ | 002-006 | Esta tarea debe completarse primero |

**Conflictos Encontrados**: 0 (Esta es la tarea base que todas las demás requieren)

## Resumen
Crear una aplicación Rails 8.1+ en modo API dentro de la carpeta `backend/` con configuración CORS para permitir requests desde el frontend React (localhost:5173). La aplicación incluirá las gemas necesarias (rack-cors, minitest), configuración de inicialización, y documentación básica en README para arrancar el servidor de desarrollo.

## Historia de Usuario
**Como** facilitador del curso
**Quiero** una aplicación Rails en modo API configurada
**Para** tener la base del backend donde se construirán los endpoints y modelos

## Archivos a Crear
- `backend/` - Estructura completa de Rails API (generada por `rails new`)
- `backend/config/initializers/cors.rb` - Configuración CORS para desarrollo
- `backend/README.md` - Documentación para iniciar el servidor
- `backend/Gemfile` - Dependencias incluyendo rack-cors y minitest
- `backend/config/routes.rb` - Configuración de rutas con namespace API

## Plan de Implementación

### Fase 1: Generación de Aplicación Rails API
Usar el generador de Rails para crear una aplicación en modo API con las opciones correctas.

### Fase 2: Configuración CORS
Configurar rack-cors para permitir requests desde el frontend durante desarrollo.

### Fase 3: Documentación y Verificación
Documentar el proceso de arranque y verificar que el servidor funciona correctamente.

## Pasos de Implementación

**IMPORTANTE**: Ejecutar cada paso en orden.

### 0. Refactorización Previa (SI SE ENCONTRARON VIOLACIONES)

**Saltar esta sección** - No se encontraron violaciones de diseño (proyecto greenfield).

### 1. Generar aplicación Rails en modo API
- Crear carpeta backend/ con Rails en modo API
- Usar SQLite como base de datos (default para desarrollo)
- Configurar para API-only (sin vistas, assets, etc.)

```bash
rails new backend --api --database=sqlite3 --skip-action-mailer --skip-action-mailbox --skip-action-text --skip-active-storage --skip-action-cable
```

### 2. Configurar Gemfile con dependencias necesarias
- Verificar que `rack-cors` está en el Gemfile
- Verificar que `minitest` está disponible (viene por default)
- Ejecutar `bundle install` para instalar dependencias

### 3. Configurar CORS para desarrollo
- Descomentar y configurar `config/initializers/cors.rb`
- Permitir origins desde `http://localhost:5173` (puerto de Vite)
- Permitir métodos: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Permitir headers necesarios para JSON API

**Archivo a modificar**: `backend/config/initializers/cors.rb`

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:5173'

    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false
  end
end
```

### 4. Configurar namespace API en routes
- Modificar `config/routes.rb` para preparar namespace /api/
- Dejar comentario indicando que los recursos se añadirán en tareas posteriores

**Archivo a modificar**: `backend/config/routes.rb`

```ruby
Rails.application.routes.draw do
  namespace :api do
    # Task resources will be added in task 003-tasks-controller
  end
end
```

### 5. Crear README con instrucciones de arranque
- Crear `backend/README.md` con instrucciones claras
- Documentar prerrequisitos (Ruby 3.2+)
- Documentar comandos de arranque
- Documentar puerto del servidor (3000)

**Archivo a crear**: `backend/README.md`

```markdown
# Todo List API - Backend

Backend Rails API para la aplicación Todo List.

## Prerrequisitos
- Ruby 3.2 o superior
- Bundler

## Instalación

```bash
# Instalar dependencias
bundle install

# Crear base de datos
rails db:create
rails db:migrate
```

## Desarrollo

```bash
# Arrancar servidor de desarrollo (puerto 3000)
rails server

# Ejecutar tests
rails test
```

## API Endpoints

Los endpoints estarán disponibles en `http://localhost:3000/api/`

(Los recursos específicos se añadirán en tareas posteriores)

## Configuración CORS

El backend está configurado para permitir requests desde:
- http://localhost:5173 (frontend React con Vite)
```

### 6. Verificar que el servidor arranca correctamente
- Navegar a carpeta backend/
- Ejecutar `bundle install`
- Ejecutar `rails db:create` para crear base de datos
- Ejecutar `rails server` para arrancar servidor
- Verificar que el servidor responde en puerto 3000
- Detener servidor con Ctrl+C

### 7. Verificar configuración CORS
- Arrancar el servidor
- Verificar que el initializer CORS está cargado correctamente
- Comprobar que no hay errores en los logs
- Detener servidor

### 8. Ejecutar tests base
- Verificar que la suite de tests funciona
- Ejecutar `rails test`
- Confirmar que todos los tests pasan (debería ser 0 tests por ahora)

## Criterios de Aceptación
- [x] Existe carpeta `backend/` con una aplicación Rails 7.1+ en modo API
- [x] La aplicación arranca exitosamente con `rails s` en puerto 3000
- [x] CORS está configurado en `config/initializers/cors.rb` para permitir localhost:5173
- [x] El archivo `Gemfile` incluye `rack-cors` y `minitest`
- [x] El README documenta cómo iniciar el servidor

## Comandos de Validación

```bash
# Verificar que el plan tiene todas las secciones requeridas
test -f features/2026-02-06-073443-todo-list-rails-react/tasks/001-backend-base-setup/plan.md

# Verificar que la aplicación Rails existe
test -d backend && test -f backend/config/application.rb

# Verificar que CORS está configurado
test -f backend/config/initializers/cors.rb

# Verificar que rack-cors está en Gemfile
grep -q "rack-cors" backend/Gemfile

# Instalar dependencias (si aún no está hecho)
cd backend && bundle install

# Crear base de datos
cd backend && rails db:create

# Ejecutar tests (debería pasar sin errores)
cd backend && rails test

# Verificar que el servidor puede arrancar (timeout 5s)
cd backend && timeout 5s rails server || test $? -eq 124
```

### Comandos de Verificación de Archivos
```bash
# Verificar estructura básica Rails
test -f backend/Gemfile && echo "✓ Gemfile"
test -f backend/config/application.rb && echo "✓ application.rb"
test -f backend/config/routes.rb && echo "✓ routes.rb"
test -f backend/config/initializers/cors.rb && echo "✓ cors.rb"
test -f backend/README.md && echo "✓ README.md"
test -d backend/app/controllers && echo "✓ controllers dir"
test -d backend/app/models && echo "✓ models dir"
test -d backend/test && echo "✓ test dir"
```

## Notas

### Decisiones de Implementación
1. **Rails 8.1+ vs 7.1+**: El sistema tiene Rails 8.1.1 instalado, que es compatible con los requisitos del PRD (Rails 7.1+)
2. **Modo API**: Se usa `--api` flag para generar solo lo necesario para una API (sin vistas, assets, helpers innecesarios)
3. **SQLite**: Database por default, ideal para desarrollo y demos del curso
4. **Sin Action Cable/Mailer/Storage**: Se omiten features no necesarias para simplificar

### Consideraciones de Seguridad
- CORS configurado solo para localhost:5173 en desarrollo
- En producción se deberá cambiar el origin permitido
- Credentials: false para evitar compartir cookies entre dominios

### Próximos Pasos
Una vez completada esta tarea, las siguientes tareas podrán:
- **002-task-model**: Crear el modelo Task con validaciones
- **003-tasks-controller**: Implementar el CRUD controller
- **004-database-seeds**: Añadir datos de ejemplo
- **005-frontend-base-setup**: Crear la aplicación React
- **006-react-components**: Implementar componentes que consuman esta API

### Verificación de Criterios
Esta tarea es exitosa cuando:
1. ✅ `cd backend && rails server` arranca sin errores en puerto 3000
2. ✅ Los logs muestran que CORS está configurado
3. ✅ `rails test` se ejecuta sin errores
4. ✅ El README documenta claramente cómo arrancar el servidor
5. ✅ La estructura sigue convenciones estándar de Rails API
