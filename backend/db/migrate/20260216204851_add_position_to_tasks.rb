class AddPositionToTasks < ActiveRecord::Migration[8.1]
  def change
    add_column :tasks, :position, :integer, null: false, default: 0

    reversible do |dir|
      dir.up do
        Task.order(:id).each_with_index do |task, index|
          task.update_column(:position, index)
        end
      end
    end
  end
end
