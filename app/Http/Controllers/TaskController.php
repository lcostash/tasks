<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the user's tasks.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Task::with('tags')
            ->forUser($user->id)
            ->orderBy('created_at', 'desc');

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Include or exclude hidden tasks
        if (!$request->boolean('show_completed')) {
            $query->where(function ($q) {
                $q->where('status', '!=', 'done')
                  ->orWhere('is_hidden', false);
            });
        }

        $tasks = $query->get();

        return response()->json($tasks);
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Task::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|in:to_do,in_progress,done',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $task = Task::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'status' => $validated['status'],
            'is_hidden' => false,
        ]);

        // Attach tags
        if (!empty($validated['tag_ids'])) {
            $task->tags()->attach($validated['tag_ids']);
        }

        return response()->json($task->load('tags'), 201);
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task)
    {
        $this->authorize('view', $task);

        return response()->json($task->load('tags'));
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'sometimes|required|in:to_do,in_progress,done',
            'is_hidden' => 'sometimes|boolean',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $task->update(array_filter([
            'title' => $validated['title'] ?? $task->title,
            'description' => $validated['description'] ?? $task->description,
            'due_date' => $validated['due_date'] ?? $task->due_date,
            'status' => $validated['status'] ?? $task->status,
            'is_hidden' => $validated['is_hidden'] ?? $task->is_hidden,
        ]));

        // Sync tags if provided
        if (isset($validated['tag_ids'])) {
            $task->tags()->sync($validated['tag_ids']);
        }

        return response()->json($task->load('tags'));
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json(null, 204);
    }

    /**
     * Toggle the visibility of completed task.
     */
    public function toggleHidden(Task $task)
    {
        $this->authorize('update', $task);

        $task->update([
            'is_hidden' => !$task->is_hidden,
        ]);

        return response()->json($task);
    }

    /**
     * Update the status of a task.
     */
    public function updateStatus(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'status' => 'required|in:to_do,in_progress,done',
        ]);

        $task->update([
            'status' => $validated['status'],
        ]);

        return response()->json($task->load('tags'));
    }
}


