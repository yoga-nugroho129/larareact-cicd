<?php

namespace App\Http\Controllers;

use App\Models\TaskAttachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TaskAttachmentController extends Controller
{
    /**
     * Display or stream the specified attachment file securely.
     */
    public function show(Request $request, TaskAttachment $attachment): StreamedResponse
    {
        if ($attachment->task->user_id !== $request->user()->id) {
            abort(403);
        }

        if (! Storage::disk('public')->exists($attachment->file_path)) {
            abort(404);
        }

        return Storage::disk('public')->response(
            $attachment->file_path,
            $attachment->file_name,
            [
                'Content-Disposition' => 'inline; filename="'.$attachment->file_name.'"',
            ]
        );
    }

    /**
     * Remove the specified attachment from storage.
     */
    public function destroy(Request $request, TaskAttachment $attachment): RedirectResponse
    {
        if ($attachment->task->user_id !== $request->user()->id) {
            abort(403);
        }

        Storage::disk('public')->delete($attachment->file_path);
        $attachment->delete();

        return redirect()->back()->with('success', 'Attachment deleted successfully.');
    }
}
