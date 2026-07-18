<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DriverProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file    = database_path('seeders/data/driver_profiles.csv');
        $csv     = array_map('str_getcsv', file($file));
        $headers = array_shift($csv);

        $rows = [];
        foreach ($csv as $row) {
            $data   = array_combine($headers, $row);
            $rows[] = [
                // identifiers
                'driver_id' => $data['driver_id'],
                'driver_name' => $data['driver_name'],
                'date' => $data['date'],
                'route_id' => $data['route_id'] ?? null,
                'vehicle_id' => $data['vehicle_id'] ?? null,
                'shift' => $data['shift'] ?? null,
                // raw telematics
                'trip_distance' => (float) $data['trip_distance'],
                'trip_duration' => (int) $data['trip_duration'],
                'speed' => (float) $data['speed'],
                'braking_events' => (int) $data['braking_events'],
                'harsh_turns' => (int) $data['harsh_turns'],
                // engineered features
                'delays_minutes'  => (int) $data['delays_minutes'],
                'behavioral_problems' => (int) $data['behavioral_problems'],
                'speeding' => (int) $data['speeding'],
                'violations_count' => (int) $data['violations'],
                'aggressive_incidents_count' => (int) $data['aggressive_incidents'],
                'rating' => (float) $data['driver_rating'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // insert by batches of 100
        foreach (array_chunk($rows, 100) as $chunk) {
            DB::table('driver_profiles')->insert($chunk);
        }

        $this->command->info('  Seeded ' . count($rows) . ' driver profile rows.');
    }
}
