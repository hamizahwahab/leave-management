<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    /**
     * List all employees with their roles and departments.
     */
    public function index(Request $request)
    {
        // Only users with 'users.view' permission can see the list
        if (!$request->user()->hasPermission('users.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Load role and department for each user
        $employees = User::with(['role', 'department'])->get();

        return response()->json([
            'success' => true,
            'data' => $employees
        ]);
    }

    /**
     * Create a new employee account.
     */
    public function store(Request $request)
    {
        // Only users with 'users.manage' permission can create employees
        if (!$request->user()->hasPermission('users.manage')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
            'department_id' => 'required|exists:departments,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'department_id' => $validated['department_id'],
        ]);

        return response()->json([
            'message' => 'Employee created successfully',
            'data' => $user->load(['role', 'department'])
        ], 201);
    }

    /**
     * View a specific employee's details.
     */
    public function show(Request $request, User $user)
    {
        if (!$request->user()->hasPermission('users.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $user->load(['role', 'department'])
        ]);
    }

    /**
     * Update employee information or role/department.
     */
    public function update(Request $request, User $user)
    {
        if (!$request->user()->hasPermission('users.manage')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role_id' => 'sometimes|exists:roles,id',
            'department_id' => 'sometimes|exists:departments,id',
            'password' => 'sometimes|string|min:8',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Employee updated successfully',
            'data' => $user->load(['role', 'department'])
        ]);
    }

    /**
     * Delete an employee account.
     */
    public function destroy(Request $request, User $user)
    {
        if (!$request->user()->hasPermission('users.manage')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Prevent deleting yourself
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete your own account'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Employee deleted successfully']);
    }
}
