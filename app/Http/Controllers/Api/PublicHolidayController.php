<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PublicHoliday;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;

class PublicHolidayController extends Controller
{
    // List all public holidays
    public function index()
    {
        // Everyone can view holidays (to see them on their calendar)
        return response()->json(PublicHoliday::orderBy('date', 'asc')->get());
    }

    // Create a new public holiday
    public function store(Request $request)
    {
        // 1. Check Authorization
        if (Gate::denies('manage-holidays')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 2. Validate
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date|unique:public_holidays,date',
            'is_replacement' => 'boolean'
        ]);

        // 3. Save
        $holiday = PublicHoliday::create([
            'name' => $validated['name'],
            'date' => $validated['date'],
            'year' => Carbon::parse($validated['date'])->year,
            'is_replacement' => $validated['is_replacement'] ?? false,
        ]);

        return response()->json($holiday, 201);
    }

    // Delete a public holiday
    public function destroy(PublicHoliday $publicHoliday)
    {
        if (Gate::denies('manage-holidays')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $publicHoliday->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
