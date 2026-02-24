class AddPositionToTasks < ActiveRecord::Migration[8.1]
  def change
    add_column :tasks, :position, :integer, null: false, default: 0
    add_index :tasks, :position
  end
end
