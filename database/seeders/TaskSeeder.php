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
                'title' => 'Setup CI/CD Pipeline with Jenkins',
                'description' => 'Configure automated testing, building, and deployment pipeline using Jenkinsfile.',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(3)->format('Y-m-d'),
            ],
            [
                'title' => 'Containerize Application with Docker',
                'description' => 'Write multi-stage Dockerfile and docker-compose.yml for web, redis, and queue workers.',
                'status' => 'todo',
                'priority' => 'high',
                'due_date' => now()->addDays(7)->format('Y-m-d'),
            ],
            [
                'title' => 'Deploy to Kubernetes Cluster',
                'description' => 'Create Kubernetes manifests including Deployments, Services, Ingress, and ConfigMaps.',
                'status' => 'todo',
                'priority' => 'medium',
                'due_date' => now()->addDays(14)->format('Y-m-d'),
            ],
            [
                'title' => 'Design Task Tracker Database Schema',
                'description' => 'Create migrations for tasks and task_attachments tables with foreign key constraints.',
                'status' => 'done',
                'priority' => 'high',
                'due_date' => now()->subDay()->format('Y-m-d'),
            ],
            [
                'title' => 'Write Feature Tests for Task CRUD',
                'description' => 'Cover all endpoints with PHPUnit tests to ensure pipeline quality gate passes.',
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
                    'file_name' => 'architecture-diagram.png',
                    'file_path' => 'attachments/sample-architecture.png',
                    'mime_type' => 'image/png',
                    'file_size' => 1024 * 350, // 350 KB
                ]);
            }
        }
    }
}
