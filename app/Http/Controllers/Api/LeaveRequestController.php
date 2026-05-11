<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LeaveRequestController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:500',
            'attachment' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        ]);

        $user = auth()->user();
        $leaveType = LeaveType::find($request->leave_type_id);

        // Calculate Total Days
        $start = Carbon::parse($request->start_date);
        $end = Carbon::parse($request->end_date);
        $totalDays = $start->diffInDays($end) + 1;

        // Check if Document is required
        if ($leaveType->needs_document && !$request->hasFile('attachment')) {
            return response()->json(['message' => "Supporting document is required for {$leaveType->name}"], 422);
        }

        // Check Leave Balance
        $balance = LeaveBalance::where('user_id', $user->id)
            ->where('leave_type_id', $leaveType->id)
            ->where('year', Carbon::now()->year)
            ->first();

        // If no balance record exists, create one using the default days from LeaveType
        if (!$balance) {
            $balance = LeaveBalance::create([
                'user_id' => $user->id,
                'leave_type_id' => $leaveType->id,
                'year' => Carbon::now()->year,
                'total_days' => $leaveType->default_days,
                'used_days' => 0,
                'remaining_days' => $leaveType->default_days,
            ]);
        }

        // Now $balance is always a Model, so this will not crash
        if ($balance->remaining_days < $totalDays) {
            return response()->json(['message' => 'Insufficient leave balance'], 422);
        }

        return DB::transaction(function () use ($request, $user, $totalDays) {
            $attachmentPath = null;
            if ($request->hasFile('attachment')) {
                $attachmentPath = $request->file('attachment')->store('leave_attachments', 'public');
            }

            $leaveRequest = LeaveRequest::create([
                'user_id' => $user->id,
                'leave_type_id' => $request->leave_type_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'total_days' => $totalDays,
                'reason' => $request->reason,
                'attachment' => $attachmentPath,
                'status' => 'pending'
            ]);

            return response()->json([
                'message' => 'Leave request submitted successfully!',
                'data' => $leaveRequest
            ], 201);
        });
    }

    public function index(Request $request)
    {
        if ($request->user()->hasPermission('leaves.view_all')) {
            $requests = LeaveRequest::with(['user', 'leaveType'])->latest()->get();
        } else {
            $requests = $request->user()
                ->leaveRequests()
                ->with(['leaveType'])
                ->latest()
                ->get();
        }

        return response()->json($requests);
    }

    public function show(LeaveRequest $leaveRequest, Request $request)
    {
        // Only owner or manager can view
        if ($leaveRequest->user_id !== $request->user()->id && !$request->user()->hasPermission('leaves.view_all')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($leaveRequest->load(['user', 'leaveType']));
    }

    public function updateStatus(Request $request, LeaveRequest $leaveRequest)
    {
        // Permission check
        if (!$request->user()->hasPermission('leaves.approve')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Cannot approve own request
        if ($leaveRequest->user_id === $request->user()->id) {
            return response()->json(['message' => 'Cannot approve your own request'], 403);
        }

        // Security: Check if it's already processed
        if ($leaveRequest->status !== 'pending') {
            return response()->json(['message' => 'This request has already been processed.'], 422);
        }

        $request->validate([
            'status' => 'required|in:approved,rejected',
            'remarks' => 'required_if:status,rejected|nullable|string|max:500'
        ], [
            'remarks.required_if' => 'Please provide a reason for rejecting this leave request.'
        ]);

        return DB::transaction(function () use ($request, $leaveRequest) {
            // If approved, deduct from balance
            if ($request->status === 'approved') {
                $balance = LeaveBalance::where('user_id', $leaveRequest->user_id)
                    ->where('leave_type_id', $leaveRequest->leave_type_id)
                    ->where('year', Carbon::now()->year)
                    ->first();

                if (!$balance || $balance->remaining_days < $leaveRequest->total_days) {
                    return response()->json(['message' => 'Insufficient balance to approve.'], 422);
                }

                $balance->used_days += $leaveRequest->total_days;
                $balance->remaining_days -= $leaveRequest->total_days;
                $balance->save();
            }

            // Update the request status and remarks
            $leaveRequest->update([
                'status' => $request->status,
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
                'remarks' => $request->remarks
            ]);

            return response()->json([
                'message' => "Leave request {$request->status}",
                'data' => $leaveRequest,
            ]);
        });
    }
}
