# == Schema Information
#
# Table name: tasks
#
#  id         :bigint           not null, primary key
#  completed  :boolean          default(FALSE), not null
#  title      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Task < ApplicationRecord
  validates :title, presence: true
  validates :title, length: { maximum: 200 }
end
