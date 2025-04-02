<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SetupCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:setup {--admin-name= : A létrehozandó Szuper Admin neve} {--admin-email= : A létrehozandó Szuper Admin email címe}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Beállítja az alkalmazást, migrációkat futtat, betölti az SQL dump-ot és létrehoz egy admin felhasználót';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Alkalmazás telepítése...');

        if (!file_exists(base_path('.env'))) {
            $this->error('A .env fájl nem található!');
            $this->line('Kérlek hozz létre egy .env fájlt a .env.example alapján:');
            $this->line('cp .env.example .env');
            $this->line('Majd állítsd be a szükséges értékeket (adatbázis, stb.)');
            return 1;
        }

        if (!env('APP_KEY')) {
            $this->info('Alkalmazás kulcs generálása...');
            $this->call('key:generate');
        }

        $this->call('migrate', ['--force' => true]);

        $this->call('db:seed', ['--force' => true]);

        $this->info('Adatbázis sikeresen feltöltve!');

        if ($this->confirm('Szeretnél létrehozni egy Szuper Admint?', true)) {
            $this->call('admin:create', [
                '--name' => $this->option('admin-name'),
                '--email' => $this->option('admin-email')
            ]);
        }

        $this->info('Az alkalmazás sikeresen telepítve!');

        return 0;
    }
}