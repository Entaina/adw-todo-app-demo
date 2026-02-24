# == Schema Information
#
# Table name: tasks
#
#  id         :bigint           not null, primary key
#  completed  :boolean          default(FALSE), not null
#  position   :integer          default(0), not null
#  title      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_tasks_on_position  (position)
#
class Task < ApplicationRecord
  default_scope { order(:position) }

  validates :title, presence: true
  validates :title, length: { maximum: 200 }

  before_create :set_default_position

  private

  def set_default_position
    self.position = (Task.unscoped.maximum(:position) || -1) + 1
  end
end
