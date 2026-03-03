class AddDueAtToTasks < ActiveRecord::Migration[8.1]
  def change
    add_column :tasks, :due_at, :datetime
  end
end
