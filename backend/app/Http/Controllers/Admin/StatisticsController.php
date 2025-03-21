<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function getProductStatistics()
    {
        $totalViews = Product::sum('view_count');
        $totalSales = Product::sum('sale_count');

        $topViewedProducts = Product::orderBy('view_count', 'desc')->take(10)->get();
        $topSoldProducts = Product::orderBy('sale_count', 'desc')->take(10)->get();

        $viewsByCategory = Product::select('categories.name as category', DB::raw('SUM(view_count) as views'))
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->groupBy('categories.name')
            ->orderBy('views', 'desc')
            ->get();

        $salesByCategory = Product::select('categories.name as category', DB::raw('SUM(sale_count) as sales'))
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->groupBy('categories.name')
            ->orderBy('sales', 'desc')
            ->get();

        return response()->json([
            'totalViews' => $totalViews,
            'totalSales' => $totalSales,
            'topViewedProducts' => $topViewedProducts,
            'topSoldProducts' => $topSoldProducts,
            'viewsByCategory' => $viewsByCategory,
            'salesByCategory' => $salesByCategory,
        ]);
    }
}
