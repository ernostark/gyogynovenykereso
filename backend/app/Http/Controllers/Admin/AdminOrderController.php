<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['status', 'user'])
            ->orderBy('created_at', 'desc');

        if ($request->has('status_id') && $request->status_id != '') {
            $query->where('status_id', $request->status_id);
        }

        $orders = $query->paginate(20);

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with(['orderItems.product.images', 'status', 'statusHistories.status', 'statusHistories.user', 'user', 'shippingMethod', 'paymentMethod'])
            ->findOrFail($id);

        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status_id' => 'required|exists:order_statuses,id',
            'comment' => 'nullable|string'
        ]);

        $order = Order::findOrFail($id);

        if ($order->status_id != $request->status_id) {
            $order->update(['status_id' => $request->status_id]);

            $order->statusHistories()->create([
                'status_id' => $request->status_id,
                'user_id' => Auth::id(),
                'comment' => $request->comment
            ]);

            $this->handleStatusSpecificActions($order, $request->status_id);

            return response()->json([
                'success' => true,
                'message' => 'Rendelés státusza sikeresen frissítve!'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'A rendelés státusza nem változott.'
        ]);
    }

    public function getStatuses()
    {
        $statuses = OrderStatus::orderBy('sort_order')->get();
        return response()->json($statuses);
    }

    private function handleStatusSpecificActions($order, $statusId)
    {
        if ($order instanceof \Illuminate\Database\Eloquent\Collection) {
            if ($order->isEmpty()) {
                return;
            }
            $order = $order->first();
        }

        switch ($statusId) {
            case 2:
                if (!$order->paid_at) {
                    $order->update(['paid_at' => now()]);
                }
                break;

            case 3:
                if (!$order->shipped_at) {
                    $order->update(['shipped_at' => now()]);
                }
                break;

            case 4:
                if (!$order->completed_at) {
                    $order->update(['completed_at' => now()]);
                }
                break;
        }
    }
}