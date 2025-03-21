<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingMethod;
use Illuminate\Http\Request;

class ShippingMethodController extends Controller
{
    public function index()
    {
        $methods = ShippingMethod::orderBy('name')->get();
        return response()->json($methods);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cost' => 'required|numeric|min:0',
            'estimated_delivery_days' => 'required|integer|min:1',
            'is_active' => 'boolean'
        ]);

        $method = ShippingMethod::create($validated);
        return response()->json(['success' => true, 'method' => $method]);
    }
    public function update(Request $request, $id)
    {
        $method = ShippingMethod::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cost' => 'required|numeric|min:0',
            'estimated_delivery_days' => 'required|integer|min:1',
            'is_active' => 'boolean'
        ]);

        $method->update($validated);
        return response()->json(['success' => true, 'method' => $method]);
    }
    public function destroy($id)
    {
        $method = ShippingMethod::findOrFail($id);

        try {
            if ($method->orders()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nem törölhető, mert rendelések vannak hozzárendelve'
                ], 400);
            }
        } catch (\Exception $e) {

        }

        $method->delete();
        return response()->json(['success' => true]);
    }

    public function toggleActive(Request $request, $id)
    {
        $method = ShippingMethod::findOrFail($id);
        $method->is_active = $request->input('is_active');
        $method->save();

        return response()->json(['success' => true, 'method' => $method]);
    }
}