<?php

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login when accessing tasks', function () {
    $this->get(route('tasks.index'))->assertRedirect(route('login'));
    $this->post(route('tasks.store'), ['title' => 'Test'])->assertRedirect(route('login'));
});

test('authenticated users can view their tasks', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    Task::factory()->count(3)->create(['user_id' => $user->id]);
    Task::factory()->count(2)->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->get(route('tasks.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tasks/index')
            ->has('tasks', 3)
            ->where('counts.total', 3)
        );
});

test('authenticated users can filter tasks by status and priority', function () {
    $user = User::factory()->create();

    Task::factory()->todo()->create(['user_id' => $user->id, 'priority' => 'high']);
    Task::factory()->inProgress()->create(['user_id' => $user->id, 'priority' => 'low']);
    Task::factory()->done()->create(['user_id' => $user->id, 'priority' => 'medium']);

    $this->actingAs($user)
        ->get(route('tasks.index', ['status' => 'todo', 'priority' => 'high']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tasks/index')
            ->has('tasks', 1)
            ->where('tasks.0.priority', 'high')
            ->where('tasks.0.status', 'todo')
        );
});

test('authenticated users can search tasks by title or description', function () {
    $user = User::factory()->create();

    Task::factory()->create([
        'user_id' => $user->id,
        'title' => 'Setup Jenkins CI Pipeline',
        'description' => 'Automate deployment on commit',
    ]);

    Task::factory()->create([
        'user_id' => $user->id,
        'title' => 'Deploy to Kubernetes',
        'description' => 'Write helm chart',
    ]);

    $this->actingAs($user)
        ->get(route('tasks.index', ['search' => 'Jenkins']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tasks/index')
            ->has('tasks', 1)
            ->where('tasks.0.title', 'Setup Jenkins CI Pipeline')
        );
});

test('authenticated users can create a task', function () {
    $user = User::factory()->create();

    $payload = [
        'title' => 'Configure Dockerfile',
        'description' => 'Multi-stage docker build for PHP',
        'status' => 'todo',
        'priority' => 'high',
        'due_date' => now()->addDays(5)->format('Y-m-d'),
    ];

    $this->actingAs($user)
        ->post(route('tasks.store'), $payload)
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('tasks', [
        'user_id' => $user->id,
        'title' => 'Configure Dockerfile',
        'status' => 'todo',
        'priority' => 'high',
    ]);
});

test('task creation requires a title', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('tasks.store'), ['title' => ''])
        ->assertSessionHasErrors(['title']);
});

test('task creation validates status and priority', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('tasks.store'), [
            'title' => 'Invalid task',
            'status' => 'invalid_status',
            'priority' => 'super_urgent',
        ])
        ->assertSessionHasErrors(['status', 'priority']);
});

test('authenticated users can create a task with an attachment', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('architecture.png', 400, 300);

    $this->actingAs($user)
        ->post(route('tasks.store'), [
            'title' => 'Task with image',
            'attachment' => $file,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $task = Task::where('title', 'Task with image')->first();
    expect($task)->not->toBeNull();
    expect($task->attachments)->toHaveCount(1);

    $attachment = $task->attachments->first();
    expect($attachment->file_name)->toBe('architecture.png');
    Storage::disk('public')->assertExists($attachment->file_path);
});

test('authenticated users can update their task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->todo()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->put(route('tasks.update', $task), [
            'title' => 'Updated Title',
            'status' => 'in_progress',
            'priority' => 'high',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'title' => 'Updated Title',
        'status' => 'in_progress',
        'priority' => 'high',
    ]);
});

test('users cannot update another user task', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherTask = Task::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->put(route('tasks.update', $otherTask), [
            'title' => 'Malicious update',
            'status' => 'done',
        ])
        ->assertForbidden();
});

test('authenticated users can delete their task and cleanup attachments', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user->id]);

    $fakeFile = UploadedFile::fake()->create('doc.pdf', 100, 'application/pdf');
    $path = $fakeFile->store('attachments', 'public');

    $attachment = $task->attachments()->create([
        'file_name' => 'doc.pdf',
        'file_path' => $path,
        'file_size' => 102400,
        'mime_type' => 'application/pdf',
    ]);

    Storage::disk('public')->assertExists($path);

    $this->actingAs($user)
        ->delete(route('tasks.destroy', $task))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    $this->assertDatabaseMissing('task_attachments', ['id' => $attachment->id]);
    Storage::disk('public')->assertMissing($path);
});

test('users cannot delete another user task', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherTask = Task::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->delete(route('tasks.destroy', $otherTask))
        ->assertForbidden();

    $this->assertDatabaseHas('tasks', ['id' => $otherTask->id]);
});

test('authenticated users can delete individual task attachments', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user->id]);

    $fakeFile = UploadedFile::fake()->image('test.png');
    $path = $fakeFile->store('attachments', 'public');

    $attachment = $task->attachments()->create([
        'file_name' => 'test.png',
        'file_path' => $path,
        'file_size' => 1024,
        'mime_type' => 'image/png',
    ]);

    $this->actingAs($user)
        ->delete(route('task-attachments.destroy', $attachment))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('task_attachments', ['id' => $attachment->id]);
    Storage::disk('public')->assertMissing($path);
    $this->assertDatabaseHas('tasks', ['id' => $task->id]);
});

test('users cannot delete another user task attachment', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherTask = Task::factory()->create(['user_id' => $otherUser->id]);

    $attachment = $otherTask->attachments()->create([
        'file_name' => 'secret.png',
        'file_path' => 'attachments/secret.png',
        'file_size' => 1024,
        'mime_type' => 'image/png',
    ]);

    $this->actingAs($user)
        ->delete(route('task-attachments.destroy', $attachment))
        ->assertForbidden();

    $this->assertDatabaseHas('task_attachments', ['id' => $attachment->id]);
});

test('authenticated users can view and download their task attachment', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user->id]);

    $fakeFile = UploadedFile::fake()->image('my-diagram.png');
    $path = $fakeFile->store('attachments', 'public');

    $attachment = $task->attachments()->create([
        'file_name' => 'my-diagram.png',
        'file_path' => $path,
        'file_size' => 1024,
        'mime_type' => 'image/png',
    ]);

    $this->actingAs($user)
        ->get(route('task-attachments.show', $attachment))
        ->assertOk();
});

test('users cannot view another user task attachment', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherTask = Task::factory()->create(['user_id' => $otherUser->id]);

    $attachment = $otherTask->attachments()->create([
        'file_name' => 'confidential.png',
        'file_path' => 'attachments/confidential.png',
        'file_size' => 1024,
        'mime_type' => 'image/png',
    ]);

    $this->actingAs($user)
        ->get(route('task-attachments.show', $attachment))
        ->assertForbidden();
});
