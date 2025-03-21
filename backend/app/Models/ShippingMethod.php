<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingMethod extends Model
{
    use HasFactory;

    /**
     * A tömegesen kitölthető attribútumok.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
        'cost',
        'estimated_delivery_days',
        'is_active'
    ];

    /**
     * Az attribútumok alapértelmezett értékei.
     *
     * @var array
     */
    protected $attributes = [
        'is_active' => true,
    ];

    /**
     * Az automatikus típuskonverziók.
     *
     * @var array
     */
    protected $casts = [
        'cost' => 'float',
        'estimated_delivery_days' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * A szállítási módot használó rendelések.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Csak az aktív szállítási módok lekérése.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}