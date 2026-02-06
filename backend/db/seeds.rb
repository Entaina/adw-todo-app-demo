# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Crear 5 tareas de ejemplo para demos y desarrollo
puts "🌱 Cargando tareas de ejemplo..."

sample_tasks = [
  { title: "Comprar leche", completed: false },
  { title: "Llamar al doctor", completed: false },
  { title: "Enviar reporte mensual", completed: true },
  { title: "Revisar correos pendientes", completed: false },
  { title: "Preparar presentación", completed: true }
]

created_count = 0
existing_count = 0

sample_tasks.each do |task_attrs|
  task = Task.find_or_create_by!(title: task_attrs[:title]) do |t|
    t.completed = task_attrs[:completed]
    created_count += 1
  end

  if task.persisted? && !task.previously_new_record?
    existing_count += 1
  end
end

puts "✓ #{created_count} tareas creadas"
puts "✓ #{existing_count} tareas ya existían"
puts "✓ Total: #{Task.count} tareas en la base de datos"
