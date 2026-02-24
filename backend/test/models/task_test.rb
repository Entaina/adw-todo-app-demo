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
require "test_helper"

class TaskTest < ActiveSupport::TestCase
  test "valid task" do
    task = Task.new(title: "Valid task")
    assert task.valid?
  end

  test "completed defaults to false" do
    task = Task.create(title: "New task")
    assert_equal false, task.completed
  end

  test "title presence" do
    task = Task.new(completed: false)
    assert_not task.valid?
    assert_includes task.errors[:title], "can't be blank"
  end

  test "title blank" do
    task = Task.new(title: "")
    assert_not task.valid?
    assert_includes task.errors[:title], "can't be blank"
  end

  test "title too long" do
    task = Task.new(title: "a" * 201)
    assert_not task.valid?
    assert_includes task.errors[:title], "is too long (maximum is 200 characters)"
  end

  test "title max length" do
    task = Task.new(title: "a" * 200)
    assert task.valid?
  end
end
