<?php

use App\Jobs\ProcessTaskAttachmentJob;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

test('process task attachment job is dispatched when an attachment is uploaded', function () {
    Queue::fake();
    Storage::fake('public');

    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('spec.png');

    $this->actingAs($user)
        ->post(route('tasks.store'), [
            'title' => 'Task requiring background processing',
            'attachment' => $file,
        ])
        ->assertRedirect();

    Queue::assertPushed(ProcessTaskAttachmentJob::class);
});

test('process task attachment job verifies storage and updates metadata', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user->id]);

    $fakeFile = UploadedFile::fake()->image('diagram.png', 200, 200);
    $path = $fakeFile->store('attachments', 'public');
    $realSize = Storage::disk('public')->size($path);

    $attachment = $task->attachments()->create([
        'file_name' => 'diagram.png',
        'file_path' => $path,
        'file_size' => 0, // initially 0 to test job update
        'mime_type' => 'image/png',
    ]);

    $job = new ProcessTaskAttachmentJob($attachment);
    $job->handle();

    expect($attachment->fresh()->file_size)->toBe($realSize);
});
