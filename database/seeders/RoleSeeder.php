<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Admin Role
        $admin = Role::create([
            'name' => 'Admin',
            'description' => 'Superuser with full access to all system settings, user management, and global configurations.'
        ]);

        $adminPermissions = Permission::whereIn('name', [
            'users.view', 'users.manage', 'roles.manage', 'permissions.manage',
            'leaves.view_all', 'leaves.approve', 'leaves.manage_types',
            'balances.view_all', 'balances.adjust', 'balances.manage_replacement',
            'holidays.manage'
        ])->pluck('id');
        $admin->permissions()->attach($adminPermissions);

        // 2. Manager Role
        $manager = Role::create([
            'name' => 'Manager',
            'description' => 'Can view employee lists and has the authority to approve or reject leave requests for their team.'
        ]);

        $managerPermissions = Permission::whereIn('name', [
            'users.view', 'leaves.view_all', 'leaves.approve',
            'balances.view_all', 'balances.manage_replacement'
        ])->pluck('id');
        $manager->permissions()->attach($managerPermissions);

        // 3. Employee Role
        $employee = Role::create([
            'name' => 'Employee',
            'description' => 'Standard user account capable of applying for leave and viewing their own personal balances.'
        ]);

        $employeePermissions = Permission::whereIn('name', [
            'leaves.apply', 'leaves.view_own', 'balances.view_own'
        ])->pluck('id');
        $employee->permissions()->attach($employeePermissions);
    }
}
