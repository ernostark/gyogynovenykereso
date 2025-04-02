<?php

namespace App\Console\Commands;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
class CreateAdmin extends Command
{
    /**
     *
     *
     * @var string
     */
    protected $signature = 'admin:create {--name= : A Szuper Admin neve} {--email= : A Szuper Admin email címe}';

    /**
     *
     *
     * @var string
     */
    protected $description = 'Létrehoz egy Szuper Admint, opcionálisan egy felhasználót is, admin joggal.';

    /**
     *
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Szuper Admin létrehozása');
        $this->line('------------------------');

        $name = $this->option('name') ?: $this->ask('Add meg a nevét');

        $email = $this->option('email') ?: $this->ask('Add meg az email címét');

        $validator = Validator::make([
            'name' => $name,
            'email' => $email
        ], [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins|unique:users'
        ]);

        if (empty($name) || strlen($name) > 50) {
            $this->error('A név megadása kötelező és nem lehet hosszabb 50 karakternél!');
            return 1;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Érvénytelen email cím formátum!');
            return 1;
        }

        if (Admin::where('email', $email)->exists()) {
            $this->error('Ez az email cím már használatban van!');
            return 1;
        }

        if (User::where('email', $email)->exists()) {
            $this->error('Ez az email cím már használatban van!');
            return 1;
        }

        $password = $this->secret('Add meg a jelszót');
        if (strlen($password) < 8) {
            $this->error('A jelszónak legalább 8 karakter hosszúnak kell lennie!');
            return 1;
        }

        $confirmPassword = $this->secret('Erősítsd meg a jelszót');
        if ($password !== $confirmPassword) {
            $this->error('A jelszavak nem egyeznek!');
            return 1;
        }

        $admin = Admin::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password)
        ]);

        $this->info('Szuper Admin sikeresen létrehozva!');

        if ($this->confirm('Szeretnéd a felhasználók közé is felvenni admin joggal?', false)) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'is_admin' => true
            ]);

            $this->info('Felhasználó létrehozva admin joggal!');
        }

        $this->info('A folyamat sikeresen befejeződött!');
        return 0;
    }
}