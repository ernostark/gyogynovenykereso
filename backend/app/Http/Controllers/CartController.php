<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = $this->getCart($request);

        return response()->json([
            'success' => true,
            'cart' => $cart->load([
                'items.product.images' => function ($query) {
                    $query->orderBy('is_primary', 'desc')
                        ->orderBy('id', 'asc');
                }
            ]),
            'total_items' => $cart->items->sum('quantity'),
            'subtotal' => $this->calculateSubtotal($cart),
            'cart_id' => $cart->id
        ])->cookie('cart_id', $cart->id, 43200);
    }
    public function addItem(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = \App\Models\Product::find($validated['product_id']);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'A termék nem található!'
            ], 404);
        }

        if ($product->stock_quantity < $validated['quantity']) {
            return response()->json([
                'success' => false,
                'message' => 'Nincs elegendő készleten!'
            ], 400);
        }

        $cart = $this->getCart($request);

        $cartItem = $cart->items()->where('product_id', $product->id)->first();
        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $validated['quantity'];
            if ($newQuantity > $product->stock_quantity) {
                $newQuantity = $product->stock_quantity;
            }
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $validated['quantity'],
                'unit_price' => $product->price,
                'discount_price' => $product->discount_price
            ]);
        }

        $cart->load([
            'items.product.images' => function ($query) {
                $query->orderBy('is_primary', 'desc')
                    ->orderBy('id', 'asc');
            }
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Termék sikeresen a kosárba helyezve!',
            'cart' => $cart,
            'total_items' => $cart->items->sum('quantity'),
            'subtotal' => $this->calculateSubtotal($cart),
            'cart_id' => $cart->id
        ])->cookie('cart_id', $cart->id, 43200);
    }
    public function updateItem(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart($request);
        $cartItem = $cart->items()->findOrFail($itemId);
        $product = $cartItem->product;

        if ($product->stock_quantity < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Nincs elegendő készleten!'
            ], 400);
        }

        $cartItem->update([
            'quantity' => $request->quantity
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kosár sikeresen frissítve!',
            'cart' => $cart->load([
                'items.product.images' => function ($query) {
                    $query->orderBy('is_primary', 'desc')
                        ->orderBy('id', 'asc');
                }
            ]),
            'total_items' => $cart->items->sum('quantity'),
            'subtotal' => $this->calculateSubtotal($cart),
            'cart_id' => $cart->id
        ])->cookie('cart_id', $cart->id, 43200);
    }
    public function removeItem(Request $request, $itemId)
    {
        $cart = $this->getCart($request);
        $cartItem = $cart->items()->findOrFail($itemId);

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Termék sikeresen eltávolítva a kosárból!',
            'cart' => $cart->load([
                'items.product.images' => function ($query) {
                    $query->orderBy('is_primary', 'desc')
                        ->orderBy('id', 'asc');
                }
            ]),
            'total_items' => $cart->items->sum('quantity'),
            'subtotal' => $this->calculateSubtotal($cart),
            'cart_id' => $cart->id
        ])->cookie('cart_id', $cart->id, 43200);
    }
    public function clear(Request $request)
    {
        $cart = $this->getCart($request);
        $cart->items()->delete();

        return response()->json([
            'success' => true,
            'message' => 'A kosár kiürítve!',
            'cart' => $cart,
            'total_items' => 0,
            'subtotal' => 0,
            'cart_id' => $cart->id
        ])->cookie('cart_id', $cart->id, 43200);
    }
    private function getCart(Request $request)
    {
        $userId = Auth::id();

        if (!$userId) {
            $token = $request->bearerToken();
            if ($token) {
                $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
                if ($tokenModel) {
                    $userId = $tokenModel->tokenable_id;
                }
            }
        }

        if (!$userId && $request->has('user_id')) {
            $providedUserId = $request->input('user_id');
            $user = \App\Models\User::find($providedUserId);
            if ($user) {
                $userId = $user->id;
            }
        }

        $sessionId = session()->getId();
        $cartId = $request->query('cart_id');

        if ($userId) {
            $userCart = Cart::where('user_id', $userId)
                ->where('status', 'active')
                ->first();

            if ($userCart) {
                if ($cartId && $cartId != $userCart->id) {
                    $guestCart = Cart::find($cartId);
                    if ($guestCart && $guestCart->user_id === null) {
                        $this->mergeGuestCart($guestCart, $userCart);
                    }
                }

                return $userCart;
            }

            if ($cartId) {
                $cart = Cart::find($cartId);
                if ($cart) {
                    $cart->update(['user_id' => $userId]);
                    return $cart;
                }
            }

            $newCart = Cart::create([
                'user_id' => $userId,
                'session_id' => $sessionId,
                'status' => 'active'
            ]);

            return $newCart;
        }

        if ($cartId) {
            $cart = Cart::find($cartId);
            if ($cart && $cart->status === 'active') {
                if (empty($cart->session_id)) {
                    $cart->update(['session_id' => $sessionId]);
                }
                return $cart;
            }
        }

        $newCart = Cart::create([
            'session_id' => $sessionId,
            'status' => 'active'
        ]);

        return $newCart;
    }
    private function mergeGuestCart($guestCart, $userCart)
    {
        foreach ($guestCart->items as $item) {
            $existingItem = $userCart->items()
                ->where('product_id', $item->product_id)
                ->first();

            if ($existingItem) {
                $existingItem->update([
                    'quantity' => $existingItem->quantity + $item->quantity
                ]);
            } else {
                $newItem = $item->replicate();
                $newItem->cart_id = $userCart->id;
                $newItem->save();
            }
        }

        $guestCart->delete();
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
}