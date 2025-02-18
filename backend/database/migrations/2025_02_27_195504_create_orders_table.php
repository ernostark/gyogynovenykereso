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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('status_id')->constrained('order_statuses');
            $table->foreignId('shipping_method_id')->constrained();
            $table->foreignId('payment_method_id')->constrained();
            
            $table->string('billing_name');
            $table->string('billing_email');
            $table->string('billing_phone')->nullable();
            $table->string('billing_country')->default('Magyarország');
            $table->string('billing_postal_code');
            $table->string('billing_city');
            $table->string('billing_street');
            $table->string('billing_address_line_2')->nullable();
            
            $table->boolean('same_as_billing')->default(true);
            $table->string('shipping_name')->nullable();
            $table->string('shipping_phone')->nullable();
            $table->string('shipping_country')->nullable();
            $table->string('shipping_postal_code')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('shipping_street')->nullable();
            $table->string('shipping_address_line_2')->nullable();
            
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_cost', 10, 2);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            
            $table->string('coupon_code')->nullable();
            $table->text('notes')->nullable();
            $table->text('admin_notes')->nullable();
            
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
