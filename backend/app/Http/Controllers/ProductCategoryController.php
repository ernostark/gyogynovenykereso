<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class ProductCategoryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:product_categories,name',
            'description' => 'nullable|string',
        ]);

        $category = ProductCategory::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Termék kategória sikeresen létrehozva!',
            'category' => $category,
        ], 201);
    }
    public function index()
    {
        $categories = ProductCategory::all();
        return response()->json($categories);
    }
    public function show($id)
    {
        try {
            $category = ProductCategory::findOrFail($id);
            return response()->json($category);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Kategória nem található',
                'error' => $e->getMessage()
            ], 404);
        }
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:product_categories,name,' . $id,
            'description' => 'nullable|string',
        ]);

        $category = ProductCategory::findOrFail($id);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Termék kategória sikeresen frissítve!',
            'category' => $category,
        ]);
    }
    public function destroy($id)
    {
        $category = ProductCategory::findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Termék kategória törölve!',
        ]);
    }

    public function getProducts($id)
    {
        try {
            $category = ProductCategory::findOrFail($id);
            $products = Product::where('category_id', $id)
                ->where('is_available', true)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'category' => $category,
                'products' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Hiba történt',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
