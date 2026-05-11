<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'department_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationship to Role
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    // Helper: Check if user has a specific role
    public function hasRole(string $roleName): bool
    {
        return $this->role?->name === $roleName;
    }

    // Relationship to Department
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // Relationship to LeaveRequests
    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    // Helper: Check if user has a specific permission
    public function hasPermission(string $permissionName): bool
    {
        return $this->role?->permissions->contains('name', $permissionName);
    }

    // Relationship to LeaveBalance
    public function leaveBalances()
    {
        return $this->hasMany(LeaveBalance::class);
    }
}
