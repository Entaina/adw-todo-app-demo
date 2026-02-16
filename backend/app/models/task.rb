class Task < ApplicationRecord
  default_scope { order(position: :asc) }

  validates :title, presence: true
  validates :title, length: { maximum: 200 }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
