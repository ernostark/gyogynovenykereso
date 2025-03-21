<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    public function index()
    {
        $methods = PaymentMethod::orderBy('sort_order')->orderBy('name')->get();
        return response()->json($methods);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'boolean'
        ]);

        $method = PaymentMethod::create($validated);
        return response()->json(['success' => true, 'method' => $method]);
    }

    public function update(Request $request, $id)
    {
        $method = PaymentMethod::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'boolean'
        ]);

        $method->update($validated);
        return response()->json(['success' => true, 'method' => $method]);
    }

    public function destroy($id)
    {
        $method = PaymentMethod::findOrFail($id);

        if ($method->orders()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Nem törölhető, mert rendelések vannak hozzárendelve'
            ], 400);
        }

        $method->delete();
        return response()->json(['success' => true]);
    }

    public function toggleActive(Request $request, $id)
    {
        $method = PaymentMethod::findOrFail($id);
        $method->is_active = $request->input('is_active');
        $method->save();

        return response()->json(['success' => true, 'method' => $method]);
    }
}