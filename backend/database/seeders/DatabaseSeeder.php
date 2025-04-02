<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $sql = File::get(database_path('sql\gyogynovenykereso.sql'));

        $statements = array_filter(array_map('trim', explode(';', $sql)));

        foreach ($statements as $statement) {
            if (!empty($statement)) {
                DB::unprepared($statement);
            }
        }

        $this->command->info('Az SQL fájl sikeresen importálva!');
    }
}