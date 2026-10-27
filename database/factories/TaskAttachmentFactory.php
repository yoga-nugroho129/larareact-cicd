<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\TaskAttachment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TaskAttachment>
 */
class TaskAttachmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $extension = fake()->randomElement(['png', 'jpg', 'pdf', 'docx']);
        $filename = fake()->word().'.'.$extension;

        return [
            'task_id' => Task::factory(),
            'file_name' => $filename,
            'file_path' => 'attachments/'.fake()->uuid().'.'.$extension,
            'file_size' => fake()->numberBetween(10240, 2048576), // 10KB to 2MB
            'mime_type' => fake()->randomElement(['image/png', 'image/jpeg', 'application/pdf']),
        ];
    }
}
