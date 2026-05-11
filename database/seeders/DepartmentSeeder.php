<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            ['name' => 'Information Technology (IT)', 'description' => 'Information Technology and Support'],
            ['name' => 'Human Resources', 'description' => 'HR and Recruitment'],
            ['name' => 'Finance', 'description' => 'Accounting and Payroll'],
            ['name' => 'Operations', 'description' => 'Daily business operations'],
            ['name' => 'Sales & Marketing', 'description' => 'Focuses on brand awareness, lead generation, and revenue growth'],
        ];

        foreach ($departments as $dept) {
            \App\Models\Department::create($dept);
        }
    }
}
