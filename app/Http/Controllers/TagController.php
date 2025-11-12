<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TagController extends Controller
{
    /**
     * Display a listing of tags available to the user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get system tags and user's own tags
        $tags = Tag::availableFor($user->id)
            ->orderBy('is_system', 'desc')
            ->orderBy('name')
            ->get();

        return response()->json($tags);
    }

    /**
     * Store a newly created user tag.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'color' => 'required|string|max:7', // Hex color
        ]);

        $tag = Tag::create([
            'name' => $validated['name'],
            'color' => $validated['color'],
            'is_system' => false,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($tag, 201);
    }

    /**
     * Update the specified user tag.
     */
    public function update(Request $request, Tag $tag)
    {
        // Only allow updating user's own tags (not system tags)
        if ($tag->is_system || $tag->user_id !== $request->user()->id) {
            abort(403, 'You can only update your own tags.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:50',
            'color' => 'sometimes|required|string|max:7',
        ]);

        $tag->update($validated);

        return response()->json($tag);
    }

    /**
     * Remove the specified user tag.
     */
    public function destroy(Request $request, Tag $tag)
    {
        // Only allow deleting user's own tags (not system tags)
        if ($tag->is_system || $tag->user_id !== $request->user()->id) {
            abort(403, 'You can only delete your own tags.');
        }

        $tag->delete();

        return response()->json(null, 204);
    }

    /**
     * Display a listing of system tags (admin only).
     */
    public function systemTags()
    {
        Gate::authorize('manage-system-tags');

        $tags = Tag::system()->orderBy('name')->get();

        return response()->json($tags);
    }

    /**
     * Store a newly created system tag (admin only).
     */
    public function storeSystemTag(Request $request)
    {
        Gate::authorize('manage-system-tags');

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'color' => 'required|string|max:7',
        ]);

        $tag = Tag::create([
            'name' => $validated['name'],
            'color' => $validated['color'],
            'is_system' => true,
            'user_id' => null,
        ]);

        return response()->json($tag, 201);
    }

    /**
     * Update a system tag (admin only).
     */
    public function updateSystemTag(Request $request, Tag $tag)
    {
        Gate::authorize('manage-system-tags');

        if (!$tag->is_system) {
            abort(400, 'This is not a system tag.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:50',
            'color' => 'sometimes|required|string|max:7',
        ]);

        $tag->update($validated);

        return response()->json($tag);
    }

    /**
     * Remove a system tag (admin only).
     */
    public function destroySystemTag(Tag $tag)
    {
        Gate::authorize('manage-system-tags');

        if (!$tag->is_system) {
            abort(400, 'This is not a system tag.');
        }

        $tag->delete();

        return response()->json(null, 204);
    }
}


