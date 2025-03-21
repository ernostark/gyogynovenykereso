<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'latin_name',
        'slug',
        'description',
        'usage',
        'price',
        'discount_price',
        'stock_quantity',
        'unit',
        'is_available',
        'is_featured'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'is_available' => 'boolean',
        'stock_quantity' => 'integer',
    ];
    protected $appends = ['primary_image'];

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function getPrimaryImageAttribute()
    {
        return $this->images()->where('is_primary', true)->first()
            ?? $this->images()->orderBy('display_order')->first();
    }

    public function getCurrentPriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }

    public function getIsOnSaleAttribute()
    {
        return $this->discount_price !== null && $this->discount_price < $this->price;
    }

    public function getDiscountPercentageAttribute()
    {
        if (!$this->is_on_sale) {
            return 0;
        }

        return round((($this->price - $this->discount_price) / $this->price) * 100);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    public function scopeSearch($query, $searchTerm)
    {
        return $query->where('name', 'like', "%{$searchTerm}%")
            ->orWhere('latin_name', 'like', "%{$searchTerm}%");
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true)
            ->where('stock_quantity', '>', 0);
    }
}
