<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    // Allows these fields to be filled via an API or Form
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'default_days',
        'is_active',
        'needs_document'
    ];

    // This ensures 'is_active' is treated as a true/false boolean in React
    protected $casts = [
        'is_active' => 'boolean',
        'needs_document' => 'boolean',
    ];
    /**
     * Get all leave requests for this leave type.
     */
    public function requests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }
}
