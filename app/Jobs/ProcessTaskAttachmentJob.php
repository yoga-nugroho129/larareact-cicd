<?php

namespace App\Jobs;

use App\Models\TaskAttachment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessTaskAttachmentJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public TaskAttachment $attachment,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Processing task attachment [ID: {$this->attachment->id}] - {$this->attachment->file_name}");

        // Verify that the file exists on storage
        if (! Storage::disk('public')->exists($this->attachment->file_path)) {
            Log::warning("Attachment file missing: {$this->attachment->file_path}");

            return;
        }

        // Example background work: update mime-type if empty or log size metrics
        $actualSize = Storage::disk('public')->size($this->attachment->file_path);
        if ($this->attachment->file_size !== $actualSize) {
            $this->attachment->update(['file_size' => $actualSize]);
        }

        Log::info("Attachment [ID: {$this->attachment->id}] processed successfully.");
    }
}
