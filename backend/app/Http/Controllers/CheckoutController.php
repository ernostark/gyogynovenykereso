<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        $cart = $this->getCart($request);
        $user = auth('sanctum')->user();
        $userId = $user ? $user->id : null;

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'A kosár üres!'
            ], 400);
        }

        $validated = $request->validate([
            'billing_name' => 'required|string|max:255',
            'billing_email' => 'required|email|max:255',
            'billing_phone' => 'nullable|string|max:20',
            'billing_country' => 'required|string|max:255',
            'billing_postal_code' => 'required|string|max:10',
            'billing_city' => 'required|string|max:255',
            'billing_street' => 'required|string|max:255',
            'billing_address_line_2' => 'nullable|string|max:255',

            'same_as_billing' => 'boolean',
            'shipping_name' => 'required_if:same_as_billing,false',
            'shipping_phone' => 'nullable|string|max:20',
            'shipping_country' => 'required_if:same_as_billing,false',
            'shipping_postal_code' => 'required_if:same_as_billing,false',
            'shipping_city' => 'required_if:same_as_billing,false',
            'shipping_street' => 'required_if:same_as_billing,false',
            'shipping_address_line_2' => 'nullable|string|max:255',

            'shipping_method_id' => 'required|exists:shipping_methods,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'notes' => 'nullable|string',
            'terms_accepted' => 'required|accepted'
        ]);

        $subtotal = $this->calculateSubtotal($cart);
        $shippingMethod = ShippingMethod::findOrFail($request->shipping_method_id);
        $shippingCost = $shippingMethod->cost;

        $freeShippingThreshold = 15000;
        if ($subtotal >= $freeShippingThreshold) {
            $shippingCost = 0;
        }

        $order = new Order([
            'order_number' => $this->generateOrderNumber(),
            'user_id' => $userId,
            'status_id' => 1,
            'shipping_method_id' => $request->shipping_method_id,
            'payment_method_id' => $request->payment_method_id,

            'billing_name' => $request->billing_name,
            'billing_email' => $request->billing_email,
            'billing_phone' => $request->billing_phone,
            'billing_country' => $request->billing_country,
            'billing_postal_code' => $request->billing_postal_code,
            'billing_city' => $request->billing_city,
            'billing_street' => $request->billing_street,
            'billing_address_line_2' => $request->billing_address_line_2,

            'same_as_billing' => $request->same_as_billing,
            'shipping_name' => $request->same_as_billing ? $request->billing_name : $request->shipping_name,
            'shipping_phone' => $request->same_as_billing ? $request->billing_phone : $request->shipping_phone,
            'shipping_country' => $request->same_as_billing ? $request->billing_country : $request->shipping_country,
            'shipping_postal_code' => $request->same_as_billing ? $request->billing_postal_code : $request->shipping_postal_code,
            'shipping_city' => $request->same_as_billing ? $request->billing_city : $request->shipping_city,
            'shipping_street' => $request->same_as_billing ? $request->billing_street : $request->shipping_street,
            'shipping_address_line_2' => $request->same_as_billing ? $request->billing_address_line_2 : $request->shipping_address_line_2,

            'subtotal' => $subtotal,
            'shipping_cost' => $shippingCost,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'total' => $subtotal + $shippingCost,

            'notes' => $request->notes,
        ]);

        $order->save();

        $order->statusHistories()->create([
            'status_id' => 1,
            'user_id' => Auth::check() ? Auth::id() : null,
            'comment' => 'Rendelés létrehozva a weboldalon'
        ]);

        foreach ($cart->items as $item) {
            $product = $item->product;

            if ($product->stock_quantity < $item->quantity) {
                $order->delete();
                return response()->json([
                    'success' => false,
                    'message' => 'Nincs elegendő készleten: ' . $product->name
                ], 400);
            }

            $orderItem = new OrderItem([
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_latin_name' => $product->latin_name,
                'quantity' => $item->quantity,
                'unit' => $product->unit,
                'unit_price' => $item->unit_price,
                'discount_price' => $item->discount_price,
                'subtotal' => ($item->discount_price ?? $item->unit_price) * $item->quantity,
            ]);

            $order->items()->save($orderItem);

            $product->decrement('stock_quantity', $item->quantity);

            $product->increment('sale_count', $item->quantity);

        }

        if (Auth::check()) {
            $cart->update(['status' => 'converted']);
        } else {
            $cart->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Rendelés sikeresen létrehozva!',
            'order_number' => $order->order_number
        ]);
    }

    private function getCart(Request $request = null)
    {
        if ($request && $request->has('cart_id')) {
            $cartFromRequest = Cart::where('id', $request->cart_id)
                ->where('status', 'active')
                ->with('items.product')
                ->first();

            if ($cartFromRequest) {
                return $cartFromRequest;
            }
        }

        $userId = Auth::check() ? Auth::id() : null;
        $sessionId = session()->getId();

        if ($userId) {
            return Cart::where('user_id', $userId)
                ->where('status', 'active')
                ->with('items.product')
                ->first();
        } else {
            return Cart::where('session_id', $sessionId)
                ->where('status', 'active')
                ->with('items.product')
                ->first();
        }
    }

    private function calculateSubtotal($cart)
    {
        $subtotal = 0;

        foreach ($cart->items as $item) {
            $price = $item->discount_price ?? $item->unit_price;
            $subtotal += $price * $item->quantity;
        }

        return $subtotal;
    }

    private function generateOrderNumber()
    {
        $prefix = 'ORD-';
        $randomPart = strtoupper(Str::random(6));
        $timestamp = date('YmdHis');

        return $prefix . $timestamp . '-' . $randomPart;
    }
}