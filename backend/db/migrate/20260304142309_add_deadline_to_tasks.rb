class AddDeadlineToTasks < ActiveRecord::Migration[8.1]
  def change
    add_column :tasks, :deadline, :date
  end
end
