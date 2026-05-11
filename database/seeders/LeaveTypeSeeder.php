<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $leaveTypes = [
            [
                'name' => 'Annual Leave',
                'description' => 'Statutory paid leave for rest and recreation. Entitlement varies by years of service (min 8-16 days).',
                'default_days' => 14, // Common mid-range default
                'needs_document' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Sick Leave',
                'description' => 'Paid leave for illness. Requires a Medical Certificate (MC) from a registered practitioner.',
                'default_days' => 14, // Standard for <2 years service
                'needs_document' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Public Holidays',
                'description' => 'Mandatory paid holidays gazetted by the government (e.g., Merdeka, Agong\'s Birthday).',
                'default_days' => 11, // Statutory minimum per Section 60D
                'needs_document' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Maternity Leave',
                'description' => '98 consecutive days of paid leave for female employees. Requires medical proof of pregnancy/birth.',
                'default_days' => 98, // Updated 2023 standard
                'needs_document' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Paternity Leave',
                'description' => '7 consecutive days for married male employees to support their spouse after childbirth.',
                'default_days' => 7, // Introduced in 2023 amendments
                'needs_document' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Unpaid Leave',
                'description' => 'Time off taken without salary when other leave balances are exhausted.',
                'default_days' => 0,
                'needs_document' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Emergency Leave',
                'description' => 'Short-notice leave for sudden personal matters or minor household crises.',
                'default_days' => 2, // Standard company policy average
                'needs_document' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Compassionate Leave',
                'description' => 'Paid leave for the death or critical illness of an immediate family member. Requires a death certificate.',
                'default_days' => 3, // Common market practice
                'needs_document' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Replacement Leave',
                'description' => 'Leave granted in lieu for employees who worked on a Rest Day or Public Holiday.',
                'default_days' => 0, // Usually earned, not given as a flat quota
                'needs_document' => true, // Usually requires proof of the work performed on holiday
                'is_active' => true,
            ],
        ];

        foreach ($leaveTypes as $type) {
            LeaveType::create($type);
        }
    }
}
