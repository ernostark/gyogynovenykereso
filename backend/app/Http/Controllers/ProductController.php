<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with([
            'category',
            'images' => function ($query) {
                $query->orderBy('is_primary', 'desc')
                    ->orderBy('id', 'asc');
            }
        ])->latest()->get();

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'latin_name' => 'nullable|string|max:255',
            'description' => 'required|string',
            'usage' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'unit' => 'required|string|max:20',
            'category_id' => 'nullable|exists:product_categories,id',
            'is_available' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'images' => 'required|array|min:1',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'primary_image_index' => 'required|integer|min:0'
        ]);

        try {
            DB::beginTransaction();

            $product = Product::create([
                'name' => $request->name,
                'latin_name' => $request->latin_name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'usage' => $request->usage,
                'price' => $request->price,
                'discount_price' => $request->discount_price,
                'stock_quantity' => $request->stock_quantity,
                'unit' => $request->unit,
                'category_id' => $request->category_id,
                'is_available' => $request->filled('is_available') ? $request->is_available : true,
                'is_featured' => $request->filled('is_featured') ? $request->is_featured : false,
            ]);

            if ($request->hasFile('images')) {
                $primaryIndex = (int) $request->primary_image_index;

                foreach ($request->file('images') as $index => $imageFile) {
                    $path = $imageFile->store('products', 'public');

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $path,
                        'is_primary' => $index === $primaryIndex,
                        'display_order' => $index,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Termék sikeresen létrehozva!',
                'product' => $product->load('images', 'category')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Hiba történt a termék létrehozása során!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $product = Product::with(['category', 'images'])->findOrFail($id);

            $product->increment('view_count');

            return response()->json($product);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Termék nem található!',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'latin_name' => 'nullable|string|max:255',
            'description' => 'required|string',
            'usage' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'unit' => 'required|string|max:20',
            'category_id' => 'nullable|exists:product_categories,id',
            'is_available' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'new_images' => 'nullable|array',
            'new_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'remove_image_ids' => 'nullable|array',
            'remove_image_ids.*' => 'nullable|exists:product_images,id',
            'primary_image_id' => 'nullable|exists:product_images,id'
        ]);

        try {
            DB::beginTransaction();

            $product = Product::findOrFail($id);

            $product->update([
                'name' => $request->name,
                'latin_name' => $request->latin_name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'usage' => $request->usage,
                'price' => $request->price,
                'discount_price' => $request->discount_price,
                'stock_quantity' => $request->stock_quantity,
                'unit' => $request->unit,
                'category_id' => $request->category_id,
                'is_available' => $request->filled('is_available') ? $request->is_available : true,
                'is_featured' => $request->filled('is_featured') ? $request->is_featured : false,
            ]);

            if ($request->has('remove_image_ids') && is_array($request->remove_image_ids)) {
                $imagesToDelete = ProductImage::where('product_id', $product->id)
                    ->whereIn('id', $request->remove_image_ids)
                    ->get();

                foreach ($imagesToDelete as $image) {
                    Storage::disk('public')->delete($image->image_url);
                    $image->delete();
                }
            }

            if ($request->hasFile('new_images')) {
                $lastOrder = $product->images()->max('display_order') ?? -1;

                foreach ($request->file('new_images') as $index => $imageFile) {
                    $path = $imageFile->store('products', 'public');

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $path,
                        'is_primary' => false,
                        'display_order' => $lastOrder + $index + 1,
                    ]);
                }
            }

            if ($request->has('primary_image_id')) {
                $product->images()->update(['is_primary' => false]);

                ProductImage::where('id', $request->primary_image_id)
                    ->where('product_id', $product->id)
                    ->update(['is_primary' => true]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Termék sikeresen frissítve!',
                'product' => $product->load('images', 'category')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Hiba történt a termék frissítése során!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $product = Product::with('images')->findOrFail($id);

            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->image_url);
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Termék sikeresen törölve!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba történt a termék törlése során!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}