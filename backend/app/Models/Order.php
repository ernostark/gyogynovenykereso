<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'status_id',
        'shipping_method_id',
        'payment_method_id',
        'billing_name',
        'billing_email',
        'billing_phone',
        'billing_country',
        'billing_postal_code',
        'billing_city',
        'billing_street',
        'billing_address_line_2',
        'same_as_billing',
        'shipping_name',
        'shipping_phone',
        'shipping_country',
        'shipping_postal_code',
        'shipping_city',
        'shipping_street',
        'shipping_address_line_2',
        'subtotal',
        'shipping_cost',
        'tax_amount',
        'discount_amount',
        'total',
        'notes',
        'paid_at',
        'shipped_at',
        'completed_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function status()
    {
        return $this->belongsTo(OrderStatus::class, 'status_id');
    }

    public function statusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function shippingMethod()
    {
        return $this->belongsTo(ShippingMethod::class, 'shipping_method_id');
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }

}