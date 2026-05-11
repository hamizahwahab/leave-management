<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // User Management
            ['name' => 'users.view', 'description' => 'View all employee profiles'],
            ['name' => 'users.manage', 'description' => 'Create, update, or delete employee accounts'],
            ['name' => 'roles.manage', 'description' => 'Create and assign roles'],
            ['name' => 'permissions.manage', 'description' => 'Edit role permissions'],

            // Leave Requests
            ['name' => 'leaves.apply', 'description' => 'Submit new leave requests'],
            ['name' => 'leaves.view_own', 'description' => 'View own leave history'],
            ['name' => 'leaves.view_all', 'description' => 'View all leave requests'],
            ['name' => 'leaves.approve', 'description' => 'Approve or reject leave requests'],
            ['name' => 'leaves.manage_types', 'description' => 'Manage leave types (Annual, Sick, etc.)'],

            // Leave Balances
            ['name' => 'balances.view_own', 'description' => 'View own leave balances'],
            ['name' => 'balances.view_all', 'description' => 'View all employee balances'],
            ['name' => 'balances.adjust', 'description' => 'Admin: Absolute control over balances'],
            ['name' => 'balances.manage_replacement', 'description' => 'Manager: Add/edit Replacement Leave'],

            // Public Holidays
            ['name' => 'holidays.manage', 'description' => 'Manage public holiday calendar'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}
