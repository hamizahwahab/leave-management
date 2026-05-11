<?php

namespace Database\Seeders;

use App\Models\PublicHoliday;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PublicHolidaySeeder extends Seeder
{

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $holidays = [
            ['name' => 'New Year\'s Day', 'date' => '2026-01-01'],
            ['name' => 'Thaipusam', 'date' => '2026-02-01'],
            ['name' => 'Thaipusam Holiday', 'date' => '2026-02-02'],
            ['name' => 'Chinese New Year', 'date' => '2026-02-17'],
            ['name' => 'Chinese New Year Holiday', 'date' => '2026-02-18'],
            ['name' => 'Nuzul Al-Quran', 'date' => '2026-03-07'],
            ['name' => 'Hari Raya Aidilfitri', 'date' => '2026-03-20'],
            ['name' => 'Hari Raya Aidilfitri', 'date' => '2026-03-21'],
            ['name' => 'Hari Raya Aidilfitri Holiday', 'date' => '2026-03-22'],
            ['name' => 'Labour Day', 'date' => '2026-05-01'],
            ['name' => 'Hari Raya Haji', 'date' => '2026-05-27'],
            ['name' => 'Wesak Day', 'date' => '2026-05-31'],
            ['name' => 'Agong\'s Birthday', 'date' => '2026-06-01'],
            ['name' => 'Wesak Day Holiday', 'date' => '2026-06-02'],
            ['name' => 'Awal Muharram', 'date' => '2026-06-17'],
            ['name' => 'Prophet Muhammad\'s Birthday', 'date' => '2026-08-25'],
            ['name' => 'Merdeka Day', 'date' => '2026-08-31'],
            ['name' => 'Malaysia Day', 'date' => '2026-09-16'],
            ['name' => 'Sultan of Perak\'s Birthday', 'date' => '2026-11-06'],
            ['name' => 'Deepavali', 'date' => '2026-11-08'],
            ['name' => 'Deepavali Holiday', 'date' => '2026-11-09'],
            ['name' => 'Christmas Day', 'date' => '2026-12-25'],
        ];

        foreach ($holidays as $holiday) {
            PublicHoliday::updateOrCreate(
                // 1. Unique identifier to search for:
                ['date' => $holiday['date']],

                // 2. Data to update or set:
                [
                    'name' => $holiday['name'],
                    'year' => Carbon::parse($holiday['date'])->year,
                ]
            );
        }
    }
}
