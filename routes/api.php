<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\LeaveTypeController;
use App\Http\Controllers\Api\PublicHolidayController;
use App\Http\Controllers\Api\LeaveBalanceController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Public Holidays: Anyone logged in can see holidays
    Route::get('/holidays', [PublicHolidayController::class, 'index']);

    // Leave Requests
    Route::get('/leave-requests', [LeaveRequestController::class, 'index']); // List leave requests
    Route::get('/leave-requests/{leaveRequest}', [LeaveRequestController::class, 'show']); // View specific leave request details
    Route::post('/leave-requests', [LeaveRequestController::class, 'store']); // Apply for leave

    // Leave Balances
    Route::get('/leave-balances', [LeaveBalanceController::class, 'index']);

    // Employee Management
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::get('/employees/{user}', [EmployeeController::class, 'show']);
    Route::put('/employees/{user}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{user}', [EmployeeController::class, 'destroy']);

    // Leave Type Management
    Route::get('/leave-types', [LeaveTypeController::class, 'index']);
    Route::post('/leave-types', [LeaveTypeController::class, 'store']);

    // Leave Requests Approval: Manager/Admin Only Actions
    Route::middleware('can:leaves.approve')->group(function () {
        Route::put('/leave-requests/{leaveRequest}/status', [LeaveRequestController::class, 'updateStatus']);
    });

    // Leave Balance Adjustment: Admin/HR Manager Only Actions
    Route::middleware('can:balances.adjust')->group(function () {
        Route::put('/leave-balances/{leaveBalance}/adjust', [LeaveBalanceController::class, 'adjust']);
    });

    // Public Holidays: Only Admin/HR Manager can modify
    Route::middleware('can:manage-holidays')->group(function () {
        Route::post('/holidays', [PublicHolidayController::class, 'store']);
        Route::delete('/holidays/{publicHoliday}', [PublicHolidayController::class, 'destroy']);
    });


});
