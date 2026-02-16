require "test_helper"

class Api::TasksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @task = create(:task)
    @completed_task = create(:task, :completed)
  end

  # Test para GET /api/tasks (index)
  test "should get index with all tasks" do
    get api_tasks_url, as: :json
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_instance_of Array, json_response
    assert_equal Task.count, json_response.length

    # Verificar estructura de cada tarea
    json_response.each do |task|
      assert task.key?("id")
      assert task.key?("title")
      assert task.key?("completed")
      assert task.key?("created_at")
      assert task.key?("updated_at")
    end
  end

  # Test para POST /api/tasks (create) exitoso
  test "should create task with valid data" do
    task_title = Faker::Lorem.sentence(word_count: 3)

    assert_difference("Task.count", 1) do
      post api_tasks_url, params: { task: { title: task_title } }, as: :json
    end

    assert_response :created
    json_response = JSON.parse(response.body)
    assert_equal task_title, json_response["title"]
    assert_equal false, json_response["completed"]
  end

  # Test para POST /api/tasks con título vacío
  test "should not create task with empty title" do
    assert_no_difference("Task.count") do
      post api_tasks_url, params: { task: { title: "" } }, as: :json
    end

    assert_response :unprocessable_entity
    json_response = JSON.parse(response.body)
    assert json_response.key?("errors")
    assert_instance_of Array, json_response["errors"]
  end

  # Test para POST /api/tasks con título muy largo
  test "should not create task with title too long" do
    long_title = "a" * 201

    assert_no_difference("Task.count") do
      post api_tasks_url, params: { task: { title: long_title } }, as: :json
    end

    assert_response :unprocessable_entity
    json_response = JSON.parse(response.body)
    assert json_response.key?("errors")
    assert_includes json_response["errors"].join, "too long"
  end

  # Test para PATCH /api/tasks/:id (update) exitoso
  test "should update task with valid data" do
    patch api_task_url(@task), params: { task: { completed: true } }, as: :json

    assert_response :success
    json_response = JSON.parse(response.body)
    assert_equal true, json_response["completed"]

    # Verificar que se actualizó en la base de datos
    @task.reload
    assert @task.completed
  end

  # Test para PATCH /api/tasks/:id con datos inválidos
  test "should not update task with invalid data" do
    original_title = @task.title

    patch api_task_url(@task), params: { task: { title: "" } }, as: :json

    assert_response :unprocessable_entity
    json_response = JSON.parse(response.body)
    assert json_response.key?("errors")

    # Verificar que NO se actualizó en la base de datos
    @task.reload
    assert_equal original_title, @task.title
  end

  # Test para DELETE /api/tasks/:id (destroy) exitoso
  test "should destroy task" do
    assert_difference("Task.count", -1) do
      delete api_task_url(@task), as: :json
    end

    assert_response :no_content
    assert_empty response.body
  end

  # Test para PATCH con ID no existente
  test "should return 404 when updating non-existent task" do
    patch api_task_url(id: 99999), params: { task: { completed: true } }, as: :json

    assert_response :not_found
    json_response = JSON.parse(response.body)
    assert json_response.key?("error")
    assert_equal "Task not found", json_response["error"]
  end

  # Test para DELETE con ID no existente
  test "should return 404 when deleting non-existent task" do
    delete api_task_url(id: 99999), as: :json

    assert_response :not_found
    json_response = JSON.parse(response.body)
    assert json_response.key?("error")
    assert_equal "Task not found", json_response["error"]
  end

  # Tests para PATCH /api/tasks/reorder
  test "reorder updates positions correctly" do
    task1 = create(:task, position: 0)
    task2 = create(:task, position: 1)
    task3 = create(:task, position: 2)

    patch reorder_api_tasks_url, params: { task_ids: [task3.id, task1.id, task2.id] }, as: :json

    assert_response :success
    assert_equal 0, task3.reload.position
    assert_equal 1, task1.reload.position
    assert_equal 2, task2.reload.position
  end

  test "reorder returns 422 when task_ids is missing" do
    patch reorder_api_tasks_url, params: {}, as: :json

    assert_response :unprocessable_entity
    json_response = JSON.parse(response.body)
    assert json_response.key?("errors")
  end

  test "reorder returns 404 when a task_id does not exist" do
    patch reorder_api_tasks_url, params: { task_ids: [@task.id, 99999] }, as: :json

    assert_response :not_found
    json_response = JSON.parse(response.body)
    assert_equal "Task not found", json_response["error"]
  end

  test "create assigns next position automatically" do
    max_position = Task.unscoped.maximum(:position).to_i
    task_title = Faker::Lorem.sentence(word_count: 3)

    post api_tasks_url, params: { task: { title: task_title } }, as: :json

    assert_response :created
    json_response = JSON.parse(response.body)
    assert_equal max_position + 1, json_response["position"]
  end

  test "index returns tasks ordered by position" do
    Task.delete_all
    task_c = create(:task, position: 2)
    task_a = create(:task, position: 0)
    task_b = create(:task, position: 1)

    get api_tasks_url, as: :json

    assert_response :success
    json_response = JSON.parse(response.body)
    assert_equal [task_a.id, task_b.id, task_c.id], json_response.map { |t| t["id"] }
  end
end
