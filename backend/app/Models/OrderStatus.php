<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStatus extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'color', 'sort_order'];

    public function orders()
    {
        return $this->hasMany(Order::class, 'status_id');
    }

    public function statusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class, 'status_id');
    }
}