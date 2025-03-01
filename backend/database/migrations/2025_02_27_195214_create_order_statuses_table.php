<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('color')->nullable();
            $table->string('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        DB::table('order_statuses')->insert([
            ['name' => 'Új rendelés', 'color' => '#3490dc', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Feldolgozás alatt', 'color' => '#f6993f', 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Kiszállítás alatt', 'color' => '#38c172', 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Teljesítve', 'color' => '#4dc0b5', 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Törölve', 'color' => '#e3342f', 'sort_order' => 5, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_statuses');
    }
};
