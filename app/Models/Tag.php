<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'color',
        'is_system',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_system' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the tag.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The tasks that belong to the tag.
     */
    public function tasks()
    {
        return $this->belongsToMany(Task::class);
    }

    /**
     * Scope a query to only include system tags.
     */
    public function scopeSystem($query)
    {
        return $query->where('is_system', true);
    }

    /**
     * Scope a query to only include user tags.
     */
    public function scopeUserTags($query, $userId = null)
    {
        $query = $query->where('is_system', false);
        
        if ($userId !== null) {
            $query->where('user_id', $userId);
        }
        
        return $query;
    }

    /**
     * Scope a query to include tags available to a user (system + their own tags).
     */
    public function scopeAvailableFor($query, $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('is_system', true)
              ->orWhere('user_id', $userId);
        });
    }
}


