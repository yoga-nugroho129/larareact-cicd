<?php

use App\Http\Controllers\TaskAttachmentController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('tasks', TaskController::class)->except(['create', 'edit', 'show']);
    Route::get('task-attachments/{attachment}', [TaskAttachmentController::class, 'show'])->name('task-attachments.show');
    Route::delete('task-attachments/{attachment}', [TaskAttachmentController::class, 'destroy'])->name('task-attachments.destroy');
});

require __DIR__.'/settings.php';
