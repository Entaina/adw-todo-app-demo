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
end
