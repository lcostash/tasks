<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Task;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin');
    }

    /**
     * Display admin dashboard with statistics.
     */
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_tasks' => Task::count(),
            'total_tags' => Tag::count(),
            'admin_users' => User::where('role', 'admin')->count(),
            'regular_users' => User::where('role', 'user')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * Display a listing of all users.
     */
    public function users()
    {
        $users = User::withCount('tasks')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Display a specific user's details.
     */
    public function showUser(User $user)
    {
        $user->load(['tasks.tags', 'tags']);

        return Inertia::render('Admin/UserDetails', [
            'viewedUser' => $user,
        ]);
    }

    /**
     * Display a specific user's dashboard.
     */
    public function userDashboard(User $user)
    {
        $tasks = Task::with('tags')
            ->forUser($user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $availableTags = Tag::availableFor($user->id)
            ->orderBy('is_system', 'desc')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/UserDashboard', [
            'viewedUser' => $user,
            'tasks' => $tasks,
            'availableTags' => $availableTags,
        ]);
    }

    /**
     * Update a user's information.
     */
    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'full_name' => 'nullable|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'role' => 'sometimes|in:admin,user',
        ]);

        $user->update($validated);

        return back()->with('success', 'User updated successfully.');
    }

    /**
     * Delete a user.
     */
    public function destroyUser(User $user)
    {
        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }

        $user->delete();

        return redirect()->route('admin.users')->with('success', 'User deleted successfully.');
    }

    /**
     * Display system tags management page.
     */
    public function systemTags()
    {
        $tags = Tag::system()->orderBy('name')->get();

        return Inertia::render('Admin/SystemTags', [
            'systemTags' => $tags,
        ]);
    }
}


