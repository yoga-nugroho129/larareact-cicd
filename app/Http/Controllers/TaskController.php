<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Jobs\ProcessTaskAttachmentJob;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of the user's tasks.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $priority = $request->query('priority');
        $search = $request->query('search');

        $query = $request->user()
            ->tasks()
            ->with('attachments')
            ->latest();

        if (is_string($status) && in_array($status, ['todo', 'in_progress', 'done'], true)) {
            $query->where('status', $status);
        }

        if (is_string($priority) && in_array($priority, ['low', 'medium', 'high'], true)) {
            $query->where('priority', $priority);
        }

        if (is_string($search) && trim($search) !== '') {
            $searchTerm = trim($search);
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        $tasks = $query->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'filters' => [
                'status' => $status,
                'priority' => $priority,
                'search' => $search,
            ],
            'counts' => [
                'total' => $request->user()->tasks()->count(),
                'todo' => $request->user()->tasks()->where('status', 'todo')->count(),
                'in_progress' => $request->user()->tasks()->where('status', 'in_progress')->count(),
                'done' => $request->user()->tasks()->where('status', 'done')->count(),
            ],
        ]);
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(StoreTaskRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        /** @var array<string, mixed> $taskData */
        $taskData = $request->safe()->except('attachment');

        if (empty($taskData['status'])) {
            $taskData['status'] = 'todo';
        }

        if (empty($taskData['priority'])) {
            $taskData['priority'] = 'medium';
        }

        /** @var Task $task */
        $task = $user->tasks()->create($taskData);

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            if ($file && $file->isValid()) {
                $path = $file->store('attachments', 'public');
                $attachment = $task->attachments()->create([
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getClientMimeType(),
                ]);

                ProcessTaskAttachmentJob::dispatch($attachment);
            }
        }

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    /**
     * Update the specified task in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        Gate::authorize('update', $task);

        /** @var array<string, mixed> $taskData */
        $taskData = $request->safe()->except('attachment');
        $task->update($taskData);

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            if ($file && $file->isValid()) {
                $path = $file->store('attachments', 'public');
                $attachment = $task->attachments()->create([
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getClientMimeType(),
                ]);

                ProcessTaskAttachmentJob::dispatch($attachment);
            }
        }

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Task $task): RedirectResponse
    {
        Gate::authorize('delete', $task);

        // Delete physical files
        foreach ($task->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $task->delete();

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }
}
