<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();
        $year = Carbon::now()->year;

        // 1. Total remaining balance across all leave types
        $balanceRemaining = LeaveBalance::where('user_id', $user->id)
            ->where('year', $year)
            ->sum('remaining_days');

        // 2. Count of pending leave requests
        $pendingCount = LeaveRequest::where('user_id', $user->id)
            ->where('status', 'pending')
            ->count();

        // 3. Count of approved leave requests
        $approvedCount = LeaveRequest::where('user_id', $user->id)
            ->where('status', 'approved')
            ->count();

        // 4. Total used days (from approved requests)
        $totalUsedDays = LeaveRequest::where('user_id', $user->id)
            ->where('status', 'approved')
            ->whereYear('created_at', $year)
            ->sum('total_days');

        // 5. Recent 5 leave requests
        $recentRequests = LeaveRequest::where('user_id', $user->id)
            ->with('leaveType')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'balance_remaining' => $balanceRemaining,
            'pending_count' => $pendingCount,
            'approved_count' => $approvedCount,
            'total_used_days' => $totalUsedDays,
            'recent_requests' => $recentRequests,
        ]);
    }
}
