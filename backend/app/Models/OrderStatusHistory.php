<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'status_id',
        'user_id',
        'comment'
    ];

    /**
     * A státusz történethez tartozó rendelés
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * A státusz történethez tartozó státusz
     */
    public function status()
    {
        return $this->belongsTo(OrderStatus::class, 'status_id');
    }

    /**
     * A státusz történethez tartozó felhasználó, aki a változtatást végezte
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}