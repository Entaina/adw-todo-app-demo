FactoryBot.define do
  factory :task do
    sequence(:position)
    title { Faker::Lorem.sentence(word_count: 3) }
    completed { false }

    trait :completed do
      completed { true }
    end
  end
end
