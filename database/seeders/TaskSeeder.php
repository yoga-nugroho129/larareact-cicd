<?php

namespace Database\Seeders;

use App\Models\TaskAttachment;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first() ?? User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'password' => 'password',
        ]);

        $tasks = [
            [
                'title' => 'Design landing page wireframes and user flow',
                'description' => 'Create Figma mockups for desktop and mobile layouts following brand guidelines.',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(3)->format('Y-m-d'),
            ],
            [
                'title' => 'Implement user authentication with Google OAuth',
                'description' => 'Enable social login so users can sign in with their Google workspace accounts.',
                'status' => 'todo',
                'priority' => 'high',
                'due_date' => now()->addDays(7)->format('Y-m-d'),
            ],
            [
                'title' => 'Optimize database queries for task dashboard',
                'description' => 'Add proper indexing on frequent filter columns and optimize eager loading relationships.',
                'status' => 'todo',
                'priority' => 'medium',
                'due_date' => now()->addDays(14)->format('Y-m-d'),
            ],
            [
                'title' => 'Design task management database schema',
                'description' => 'Create relational tables for tasks and task attachments with foreign key constraints.',
                'status' => 'done',
                'priority' => 'high',
                'due_date' => now()->subDay()->format('Y-m-d'),
            ],
            [
                'title' => 'Implement drag and drop for Kanban columns',
                'description' => 'Enhance user experience by allowing quick status transitions via interactive cards.',
                'status' => 'todo',
                'priority' => 'low',
                'due_date' => now()->addDays(5)->format('Y-m-d'),
            ],
        ];

        foreach ($tasks as $taskData) {
            $task = $user->tasks()->create($taskData);

            // Add sample attachment to some tasks
            if ($task->priority === 'high') {
                TaskAttachment::factory()->create([
                    'task_id' => $task->id,
                    'file_name' => 'wireframe-mockup.png',
                    'file_path' => 'attachments/sample-wireframe.png',
                    'mime_type' => 'image/png',
                    'file_size' => 1024 * 350, // 350 KB
                ]);
            }
        }
    }
}
