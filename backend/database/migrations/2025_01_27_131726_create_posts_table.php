<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->string('image_path')->nullable();
            $table->text('excerpt')->nullable();
            $table->json('diseases')->nullable();
            $table->boolean('featured')->default(false);
            $table->unsignedBigInteger('author_id');
            $table->enum('author_type', ['user', 'admin'])->default('user');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->timestamp('published_at')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};