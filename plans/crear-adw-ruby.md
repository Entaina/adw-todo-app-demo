# Chore: Crear ADW (AI Developer Workflow) en Ruby

## Descripcion del Chore
Replicar en Ruby el sistema ADW (AI Developer Workflow) que existe en Python en `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/adws`. El ADW es un sistema de automatizacion agentico que:

1. Monitoriza issues de GitHub (via cron polling o CLI manual)
2. Clasifica issues por tipo (chore, bug, feature)
3. Genera planes de implementacion usando Claude Code CLI
4. Implementa las soluciones
5. Crea commits y pull requests

El flujo completo es: **Issue -> Clasificar -> Branch -> Planificar -> Commit Plan -> Implementar -> Commit Implementacion -> Pull Request**.

Cada etapa ejecuta Claude Code CLI como subproceso, usando los slash commands existentes del proyecto (`/chore`, `/bug`, `/feature`, `/implement`, `/git:commit`) y 4 nuevos slash commands ADW-especificos.

## Archivos Relevantes
Ficheros de referencia del sistema Python original:

- `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/adws/adw_plan_build.py` - Orquestador principal del workflow
- `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/adws/agent.py` - Wrapper del CLI de Claude Code
- `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/adws/github.py` - Operaciones con GitHub via `gh` CLI
- `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/adws/data_types.py` - Modelos de datos (Pydantic)
- `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/adws/utils.py` - Utilidades (logging, ID generation)
- `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/adws/trigger_cron.py` - Trigger via polling

Slash commands de referencia del sistema Python original:
- `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/.claude/commands/classify_issue.md` - Clasificar issues
- `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/.claude/commands/find_plan_file.md` - Encontrar fichero del plan
- `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/.claude/commands/generate_branch_name.md` - Generar nombre de branch
- `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/.claude/commands/commit.md` - Commit estructurado
- `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/.claude/commands/pull_request.md` - Crear PR

Slash commands existentes en el proyecto actual que el ADW reutilizara:
- `.claude/commands/bug.md` - Planificar bugs
- `.claude/commands/chore.md` - Planificar chores
- `.claude/commands/feature.md` - Planificar features
- `.claude/commands/implement.md` - Implementar un plan
- `.claude/commands/git/commit.md` - Hacer commit (compatible con formato ADW via `-m "sdlc_planner: feat: ..."`)

### Ficheros Nuevos

Scripts Ruby del ADW en `adws/`:

- `adws/Gemfile` - Dependencias Ruby (dry-struct, dry-types, rufus-scheduler, dotenv)
- `adws/.env.example` - Ejemplo de variables de entorno
- `adws/lib/adw.rb` - Require principal del modulo ADW
- `adws/lib/adw/data_types.rb` - Modelos de datos con dry-struct
- `adws/lib/adw/utils.rb` - Utilidades (logging, ID generation)
- `adws/lib/adw/github.rb` - Operaciones con GitHub via `gh` CLI
- `adws/lib/adw/agent.rb` - Wrapper del CLI de Claude Code
- `adws/bin/adw_plan_build` - Orquestador principal (ejecutable)
- `adws/bin/trigger_cron` - Trigger via polling (rufus-scheduler)

Slash commands nuevos en `.claude/commands/adw/`:

- `.claude/commands/adw/classify_issue.md` - Clasificar issues de GitHub
- `.claude/commands/adw/find_plan_file.md` - Encontrar fichero del plan generado
- `.claude/commands/adw/generate_branch_name.md` - Generar nombre de branch y crearlo
- `.claude/commands/adw/pull_request.md` - Crear pull request en GitHub

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

### 1. Crear estructura de directorios y Gemfile

- Crear directorio `adws/` con subdirectorios `lib/adw/`, `bin/`
- Crear `adws/Gemfile` con las dependencias:
  ```ruby
  source "https://rubygems.org"

  gem "dry-struct"        # Modelos de datos tipados
  gem "dry-types"         # Sistema de tipos para dry-struct
  gem "rufus-scheduler"   # Cron-like polling
  gem "dotenv"            # Carga de .env
  ```
- Crear `adws/.env.example` con las variables de entorno:
  ```
  CLAUDE_CODE_PATH=claude
  GITHUB_PAT=           # Opcional: solo si usas cuenta GitHub diferente a 'gh auth login'
  ```
- Ejecutar `cd adws && bundle install` para generar el `Gemfile.lock`

### 2. Crear modelos de datos (`adws/lib/adw/data_types.rb`)

Equivalente a `data_types.py`. Usar **dry-struct** + **dry-types**.

Definir modulo `Types` con `include Dry.Types()`. Cada struct usa `transform_keys` para convertir camelCase → snake_case desde JSON de GitHub.

Structs:
- `Adw::GitHubUser` - `login` (String), `name` (String.optional)
- `Adw::GitHubLabel` - `id` (String), `name` (String), `color` (String), `description` (String.optional)
- `Adw::GitHubComment` - `id` (String), `author` (GitHubUser), `body` (String), `created_at` (String)
- `Adw::GitHubIssueListItem` - `number` (Integer), `title` (String), `body` (String), `labels` (Array.of(GitHubLabel)), `created_at` (String), `updated_at` (String)
- `Adw::GitHubIssue` - `number`, `title`, `body`, `state`, `author`, `assignees`, `labels`, `milestone`, `comments`, `created_at`, `updated_at`, `closed_at`, `url`. Incluir metodo `to_json` que serializa con camelCase
- `Adw::AgentPromptRequest` - `prompt`, `adw_id`, `agent_name`, `model` (default "sonnet"), `dangerously_skip_permissions` (default false), `output_file`
- `Adw::AgentPromptResponse` - `output` (String), `success` (Bool), `session_id` (String.optional)
- `Adw::AgentTemplateRequest` - `agent_name`, `slash_command`, `args` (Array.of(String)), `adw_id`, `model` (default "sonnet")

Constantes:
- `ISSUE_CLASS_COMMANDS = %w[/chore /bug /feature].freeze`

### 3. Crear modulo de utilidades (`adws/lib/adw/utils.rb`)

Equivalente a `utils.py`:

- `Adw::Utils.make_adw_id` - Genera UUID de 8 caracteres usando `SecureRandom.uuid[0..7]`
- `Adw::Utils.setup_logger(adw_id, trigger_type)` - Crea logger Ruby con:
  - Output a fichero: `agents/{adw_id}/{trigger_type}/execution.log` (nivel DEBUG)
  - Output a consola: STDOUT (nivel INFO)
  - Formato fichero: `%Y-%m-%d %H:%M:%S - LEVEL - message`
  - Formato consola: solo el mensaje
  - Crear directorio si no existe con `FileUtils.mkdir_p`
- `Adw::Utils.get_logger(adw_id)` - Recuperar logger existente usando hash de clase `@loggers`

### 4. Crear modulo GitHub (`adws/lib/adw/github.rb`)

Equivalente a `github.py`. Apoyarse completamente en **`gh` CLI** via `Open3.capture3`:

- `Adw::GitHub.github_env` - Hash con `GH_TOKEN` y `PATH` si `GITHUB_PAT` esta definido, `nil` en caso contrario (hereda env del padre)
- `Adw::GitHub.repo_url` - `git remote get-url origin`
- `Adw::GitHub.extract_repo_path(url)` - Extrae `owner/repo` quitando `https://github.com/` y `.git`
- `Adw::GitHub.fetch_issue(issue_number, repo_path)` - `gh issue view <number> -R <repo> --json number,title,body,state,author,assignees,labels,milestone,comments,createdAt,updatedAt,closedAt,url` → `GitHubIssue`
- `Adw::GitHub.make_issue_comment(issue_id, comment)` - `gh issue comment <id> -R <repo> --body <comment>`
- `Adw::GitHub.mark_issue_in_progress(issue_id)` - `gh issue edit --add-label in_progress --add-assignee @me`
- `Adw::GitHub.fetch_open_issues(repo_path)` - `gh issue list --repo <repo> --state open --json ... --limit 1000` → `[GitHubIssueListItem]`
- `Adw::GitHub.fetch_issue_comments(repo_path, issue_number)` - `gh issue view <number> --repo <repo> --json comments` → array de hashes

### 5. Crear modulo Agent (`adws/lib/adw/agent.rb`)

Equivalente a `agent.py`. Wrapper de Claude Code CLI:

- `Adw::Agent.claude_path` - Lee `ENV["CLAUDE_CODE_PATH"]` o default `"claude"`
- `Adw::Agent.check_installed` - Valida que el CLI existe ejecutando `claude --version`
- `Adw::Agent.check_authenticated` - Verifica `~/.claude/.credentials.json` existe y es JSON valido
- `Adw::Agent.claude_env` - Retorna hash de environment para el subproceso:
  - `HOME`, `USER`, `PATH`, `SHELL`, `TERM`
  - `CLAUDE_CODE_PATH`, `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR=true`
  - `GH_TOKEN` (solo si `GITHUB_PAT` esta definido)
  - **Excluye** `ANTHROPIC_API_KEY` para forzar auth via subscription
- `Adw::Agent.save_prompt(prompt, adw_id, agent_name)` - Guarda el prompt en `agents/{adw_id}/{agent_name}/prompts/{command}.txt`
- `Adw::Agent.parse_jsonl(file_path)` - Parsea fichero JSONL linea a linea, retorna `[messages, result_message]`
- `Adw::Agent.convert_jsonl_to_json(jsonl_file)` - Convierte JSONL a JSON array
- `Adw::Agent.prompt_claude_code(request)` - Ejecuta Claude Code CLI:
  - Construye comando: `claude -p "prompt" --model model --output-format stream-json --verbose`
  - Añade `--dangerously-skip-permissions` si esta habilitado
  - Redirige stdout a fichero JSONL
  - Parsea resultado y retorna `AgentPromptResponse`
  - Usa `Open3.popen3` o `system` con redireccion
- `Adw::Agent.execute_template(request)` - Ejecuta un slash command:
  - Construye prompt: `"/command arg1 arg2"`
  - Crea directorio output: `agents/{adw_id}/{agent_name}/`
  - Llama a `prompt_claude_code` con los parametros correctos
  - Retorna `AgentPromptResponse`

### 6. Crear require principal (`adws/lib/adw.rb`)

Fichero que carga todos los modulos:
```ruby
require_relative "adw/data_types"
require_relative "adw/utils"
require_relative "adw/github"
require_relative "adw/agent"
```

### 7. Crear los slash commands nuevos para ADW

El ADW necesita 4 slash commands nuevos en `.claude/commands/adw/`. Se reutilizan los existentes `/chore`, `/bug`, `/feature`, `/implement`, `/git:commit`.

#### `.claude/commands/adw/classify_issue.md`
Referencia: `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/.claude/commands/classify_issue.md`
- Input: JSON del issue como `$ARGUMENTS`
- Analiza el issue y clasifica como chore, bug, o feature
- Usa el Command Mapping para seleccionar: `/chore`, `/bug`, `/feature`, o `0`
- Output: Responde SOLO con el slash command apropiado (ej: `/feature`)

#### `.claude/commands/adw/find_plan_file.md`
Referencia: `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/.claude/commands/find_plan_file.md`
- **Adaptacion**: buscar en `plans/` en vez de `specs/`
- Input: output del paso anterior como `$ARGUMENTS`
- Usa git status, `git diff --name-only origin/main...HEAD plans/`, y parseo del output
- Output: SOLO la ruta del fichero (ej: `plans/add-auth.md`) o `0`

#### `.claude/commands/adw/generate_branch_name.md`
Referencia: `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/.claude/commands/generate_branch_name.md`
- Variables: `issue_class ($1)`, `adw_id ($2)`, `issue ($3)`
- Formato: `{issue_class}-{issue_number}-{adw_id}-{concise_name}`
- Ejecuta: `git checkout main && git pull && git checkout -b <branch>`
- Output: SOLO el nombre del branch creado

#### `.claude/commands/adw/pull_request.md`
Referencia: `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/.claude/commands/pull_request.md`
- Variables: `branch_name ($1)`, `issue ($2)`, `plan_file ($3)`, `adw_id ($4)`
- PR title: `<issue_type>: #<issue_number> - <issue_title>`
- PR body: summary, link al plan, referencia al issue (Closes #N), ADW tracking ID
- Ejecuta: `git push -u origin <branch>`, `gh pr create --title ... --body ... --base main`
- Output: SOLO la URL de la PR

### 8. Crear orquestador principal (`adws/bin/adw_plan_build`)

Equivalente a `adw_plan_build.py`. Script ejecutable Ruby (`#!/usr/bin/env ruby`).

Constantes de nombres de agentes:
- `AGENT_PLANNER = "sdlc_planner"`
- `AGENT_IMPLEMENTOR = "sdlc_implementor"`
- `AGENT_CLASSIFIER = "issue_classifier"`
- `AGENT_PLAN_FINDER = "plan_finder"`
- `AGENT_BRANCH_GENERATOR = "branch_generator"`
- `AGENT_PR_CREATOR = "pr_creator"`

Metodos principales:
- `check_env_vars(logger)` - Valida env vars requeridas
- `parse_args` - Parsea ARGV: `adw_plan_build <issue-number> [adw-id]`
- `format_issue_message(adw_id, agent_name, message)` - Formatea mensaje para issue comments
- `classify_issue(issue, adw_id, logger)` - Clasifica issue usando `/adw:classify_issue`
- `build_plan(issue, command, adw_id, logger)` - Genera plan usando `/chore`, `/bug`, o `/feature`
- `get_plan_file(plan_output, adw_id, logger)` - Encuentra el fichero del plan usando `/adw:find_plan_file`
- `implement_plan(plan_file, adw_id, logger)` - Implementa usando `/implement`
- `git_branch(issue, issue_class, adw_id, logger)` - Genera y crea branch usando `/adw:generate_branch_name`
- `git_commit(agent_name, issue, issue_class, adw_id, logger)` - Crea commit usando `/git:commit -m "agent: type: message"`
- `pull_request(branch_name, issue, plan_file, adw_id, logger)` - Crea PR usando `/adw:pull_request`
- `check_error(error_or_response, issue_number, adw_id, agent_name, error_prefix, logger)` - Manejo uniforme de errores

Flujo `main`:
1. Cargar env vars con dotenv
2. Parsear argumentos (issue_number, adw_id opcional)
3. Generar adw_id si no se proporciona
4. Setup logger
5. Validar env vars
6. Obtener repo URL y repo_path via `gh`
7. Fetch issue desde GitHub con `gh issue view`
8. Comentar en issue: "Starting ADW workflow"
9. **Clasificar** → `/adw:classify_issue` → obtiene `/chore`, `/bug`, o `/feature`
10. **Crear branch** → `/adw:generate_branch_name`
11. **Planificar** → ejecuta el command clasificado (`/chore`, `/bug`, o `/feature`)
12. **Encontrar plan** → `/adw:find_plan_file`
13. **Commit plan** → `/git:commit -m "sdlc_planner: {type}: ..."`
14. **Implementar** → `/implement {plan_file}`
15. **Commit implementacion** → `/git:commit -m "sdlc_implementor: {type}: ..."`
16. **Crear PR** → `/adw:pull_request`
17. Comentar en issue: "Workflow completed"

Hacer el fichero ejecutable: `chmod +x adws/bin/adw_plan_build`

### 9. Crear trigger cron (`adws/bin/trigger_cron`)

Equivalente a `trigger_cron.py`. Polling scheduler con `rufus-scheduler`:

- Shebang: `#!/usr/bin/env ruby`
- Polling cada 20 segundos con `rufus-scheduler`
- Funcionalidad:
  - `should_process_issue?(issue_number)` - Verifica si el issue debe procesarse via `gh issue view`:
    - Sin comentarios → procesar
    - Ultimo comentario es exactamente "adw" → procesar
  - `trigger_workflow(issue_number)` - Lanza `adw_plan_build` como subproceso con `Process.spawn`
  - `check_and_process_issues` - Funcion principal del ciclo:
    - Fetch issues abiertos con `gh issue list`
    - Filtra los no procesados
    - Procesa los que califican
- Mantiene `Set` de issues procesados en memoria
- Manejo de señales SIGINT/SIGTERM con `Signal.trap` para shutdown graceful
- Hacer el fichero ejecutable: `chmod +x adws/bin/trigger_cron`

### 10. Ejecutar comandos de validacion

Ejecutar los comandos de validacion para asegurar que todo funciona correctamente.

## Comandos de Validacion
Ejecuta cada comando para validar que el chore esta completo sin regresiones.

- `cd adws && bundle install` - Verifica que las dependencias Ruby se instalan correctamente
- `cd adws && ruby -c lib/adw.rb && ruby -c lib/adw/data_types.rb && ruby -c lib/adw/utils.rb && ruby -c lib/adw/github.rb && ruby -c lib/adw/agent.rb` - Verifica sintaxis correcta de todos los modulos Ruby
- `cd adws && ruby -c bin/adw_plan_build && ruby -c bin/trigger_cron` - Verifica sintaxis correcta de los scripts ejecutables
- `cd adws && ruby -e "require_relative 'lib/adw'; puts 'ADW module loaded successfully'"` - Verifica que el modulo se carga correctamente
- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar que el chore esta completo sin regresiones
- `cd frontend && npm test` - Ejecuta los tests del frontend para validar que el chore esta completo sin regresiones

## Notas

- **Modelos de datos**: Usar dry-struct + dry-types (equivalente Ruby de Pydantic). Cada struct usa `transform_keys` para manejar camelCase de la API de GitHub.

- **GitHub CLI**: Apoyarse completamente en `gh` CLI para todas las operaciones GitHub (fetch issues, post comments, create PRs, etc.) via `Open3.capture3`.

- **Solo trigger_cron**: No se implementa webhook ni health_check como ejecutables separados. Solo el trigger cron y el orquestador manual.

- **Commit via `/git:commit`**: Se reutiliza el comando `/git:commit` existente para los commits del ADW. Es compatible con el formato estructurado via `-m "sdlc_planner: feat: implement plan for #123"`.

- **Namespace `adw/`**: Los 4 slash commands nuevos se crean en `.claude/commands/adw/` para evitar conflictos con los existentes. Se invocan como `/adw:classify_issue`, `/adw:find_plan_file`, etc.

- **Autenticacion**: El ADW usa autenticacion via subscription de Claude Code (`claude login`), NO api keys. Se excluye `ANTHROPIC_API_KEY` del environment del subproceso.

- **Output de Claude Code**: El CLI produce JSONL (stream-json). Cada linea es un JSON completo. La ultima linea con `"type": "result"` contiene la respuesta final.

- **Directorio de output**: Los resultados de cada agente se guardan en `agents/{adw_id}/{agent_name}/` con ficheros `raw_output.jsonl`, `raw_output.json`, y `prompts/{command}.txt`.

- **Nombres de branch**: Siguen el patron `{type}-{issue_number}-{adw_id}-{slug}`, ej: `feat-123-a1b2c3d4-add-login`.

- **El sistema Python original esta en**: `/Users/elafo/workspace/elafo/agentic-engineer/tac-4/adws/` - Usarlo como referencia fiel durante la implementacion.
