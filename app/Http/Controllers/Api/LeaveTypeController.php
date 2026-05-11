<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeaveType;

class LeaveTypeController extends Controller
{
    public function index(Request $request)
    {

        $leaveTypes = LeaveType::all();

        return response()->json(['data' => $leaveTypes]);
    }

    public function store(Request $request)
    {
        if (!$request->user()->hasPermission('leaves.manage_types')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:leave_types,name',
            'description' => 'nullable|string',
        ]);

        $leaveType = LeaveType::create($validated);

        return response()->json([
            'message' => 'Leave type created successfully',
            'data' => $leaveType
        ], 201);
    }
}
