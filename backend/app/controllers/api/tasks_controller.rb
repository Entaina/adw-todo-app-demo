class Api::TasksController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  # GET /api/tasks
  def index
    tasks = Task.all
    render json: tasks, status: :ok
  end

  # POST /api/tasks
  def create
    task = Task.new(task_params)
    task.position = Task.unscoped.maximum(:position).to_i + 1

    if task.save
      render json: task, status: :created
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/tasks/reorder
  def reorder
    task_ids = params[:task_ids]

    if task_ids.blank?
      return render json: { errors: ["task_ids parameter is required"] }, status: :unprocessable_entity
    end

    tasks = Task.unscoped.where(id: task_ids)
    if tasks.count != task_ids.length
      return render json: { error: "Task not found" }, status: :not_found
    end

    ActiveRecord::Base.transaction do
      task_ids.each_with_index do |id, index|
        Task.unscoped.where(id: id).update_all(position: index)
      end
    end

    render json: Task.all, status: :ok
  end

  # PATCH/PUT /api/tasks/:id
  def update
    task = Task.find(params[:id])

    if task.update(task_params)
      render json: task, status: :ok
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/tasks/:id
  def destroy
    task = Task.find(params[:id])
    task.destroy
    head :no_content
  end

  private

  def task_params
    params.require(:task).permit(:title, :completed, :position)
  end

  def record_not_found
    render json: { error: "Task not found" }, status: :not_found
  end
end
