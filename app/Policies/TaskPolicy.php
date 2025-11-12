<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Determine if the user can view any tasks.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view the task.
     */
    public function view(User $user, Task $task): bool
    {
        // Admins can view all tasks, users can only view their own
        return $user->isAdmin() || $task->user_id === $user->id;
    }

    /**
     * Determine if the user can create tasks.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can update the task.
     */
    public function update(User $user, Task $task): bool
    {
        // Admins can update all tasks, users can only update their own
        return $user->isAdmin() || $task->user_id === $user->id;
    }

    /**
     * Determine if the user can delete the task.
     */
    public function delete(User $user, Task $task): bool
    {
        // Admins can delete all tasks, users can only delete their own
        return $user->isAdmin() || $task->user_id === $user->id;
    }
}


