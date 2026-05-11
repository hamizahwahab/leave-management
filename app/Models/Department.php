<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = ['name', 'description'];

    /**
     * Get all users belonging to this department.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
