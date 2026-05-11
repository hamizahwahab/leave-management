<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveBalance;
use Illuminate\Http\Request;

class LeaveBalanceController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->hasPermission('balances.view_all')) {
            // Admin/Manager: See everyone's balances
            $balances = LeaveBalance::with(['user', 'leaveType'])->get();
        } else {
            // Employee: See only own balances
            $balances = LeaveBalance::where('user_id', $request->user()->id)
                ->with('leaveType')
                ->get();
        }

        return response()->json(['data' => $balances]);
    }

    public function adjust(Request $request, LeaveBalance $leaveBalance)
    {
        if (!$request->user()->hasPermission('balances.adjust')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'days' => 'required|integer', // Can be positive (add) or negative (subtract)
            'reason' => 'required|string|max:500',
        ]);

        // Update the balance
        $leaveBalance->total_days += $request->days;
        $leaveBalance->remaining_days += $request->days;
        $leaveBalance->save();

        // Optional: Log this action or send a notification to the user

        return response()->json([
            'message' => 'Balance adjusted successfully',
            'data' => $leaveBalance
        ]);
    }
}
