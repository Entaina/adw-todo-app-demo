require "test_helper"

class TaskTest < ActiveSupport::TestCase
  test "valid task" do
    task = build(:task)
    assert task.valid?
  end

  test "completed defaults to false" do
    task = create(:task)
    assert_equal false, task.completed
  end

  test "title presence" do
    task = build(:task, title: nil)
    assert_not task.valid?
    assert_includes task.errors[:title], "can't be blank"
  end

  test "title blank" do
    task = build(:task, title: "")
    assert_not task.valid?
    assert_includes task.errors[:title], "can't be blank"
  end

  test "title too long" do
    task = build(:task, title: "a" * 201)
    assert_not task.valid?
    assert_includes task.errors[:title], "is too long (maximum is 200 characters)"
  end

  test "title max length" do
    task = build(:task, title: "a" * 200)
    assert task.valid?
  end

  test "position is valid with non-negative integers" do
    task = build(:task, position: 0)
    assert task.valid?

    task.position = 5
    assert task.valid?
  end

  test "position does not accept negative values" do
    task = build(:task, position: -1)
    assert_not task.valid?
    assert_includes task.errors[:position], "must be greater than or equal to 0"
  end

  test "tasks are ordered by position by default" do
    Task.delete_all
    task_c = create(:task, position: 2)
    task_a = create(:task, position: 0)
    task_b = create(:task, position: 1)

    tasks = Task.all
    assert_equal [task_a.id, task_b.id, task_c.id], tasks.map(&:id)
  end
end
