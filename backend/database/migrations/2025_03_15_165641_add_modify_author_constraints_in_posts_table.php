<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Kapcsoljuk ki ideiglenesen a külső kulcs ellenőrzést
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Töröljük a külső kulcsot a posts táblában
        $foreignKeys = $this->getForeignKeys('posts');
        foreach ($foreignKeys as $foreignKey) {
            if (strpos($foreignKey, 'author_id') !== false) {
                Schema::table('posts', function (Blueprint $table) use ($foreignKey) {
                    $table->dropForeign($foreignKey);
                });
                break;
            }
        }
        
        // Frissítsük a korábban létrehozott bejegyzések author_type értékét
        DB::table('posts')->update(['author_type' => 'admin']);
        
        // Kapcsoljuk vissza a külső kulcs ellenőrzést
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }

    /**
     * A táblában lévő külső kulcsok neveinek lekérdezése
     */
    private function getForeignKeys($tableName)
    {
        $conn = Schema::getConnection()->getDoctrineSchemaManager();
        
        $foreignKeys = [];
        
        foreach ($conn->listTableForeignKeys($tableName) as $foreignKey) {
            $foreignKeys[] = $foreignKey->getName();
        }
        
        return $foreignKeys;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nem állítjuk vissza a külső kulcsot, mivel most már két táblából is származhatnak a szerzők
    }
};