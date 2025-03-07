<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletter_subscribers,email,NULL,id,is_active,1',
            'privacy_accepted' => 'required|accepted'
        ]);

        $existingSubscriber = NewsletterSubscriber::where('email', $request->email)
            ->where('is_active', false)
            ->first();

        if ($existingSubscriber) {
            $existingSubscriber->update([
                'is_active' => true,
                'token' => Str::random(64),
                'subscribed_at' => now(),
                'unsubscribed_at' => null
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Sikeresen újra feliratkoztál hírlevelünkre!'
            ]);
        }

        NewsletterSubscriber::create([
            'email' => $request->email,
            'user_id' => auth()->check() ? auth()->id() : null,
            'token' => Str::random(64),
            'is_active' => true,
            'subscribed_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sikeresen feliratkoztál hírlevelünkre!'
        ]);
    }
    public function unsubscribeWithToken($token)
    {
        $subscriber = NewsletterSubscriber::where('token', $token)
            ->where('is_active', true)
            ->first();

        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Érvénytelen leiratkozási link vagy már leiratkoztál.'
            ], 404);
        }

        $subscriber->update([
            'is_active' => false,
            'unsubscribed_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sikeresen leiratkoztál hírlevelünkről.'
        ]);
    }
    public function toggleStatus($id)
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);

        $subscriber->is_active = !$subscriber->is_active;

        if ($subscriber->is_active) {
            $subscriber->unsubscribed_at = null;
            $subscriber->subscribed_at = now();
        } else {
            $subscriber->unsubscribed_at = now();
        }

        $subscriber->save();

        return response()->json([
            'success' => true,
            'message' => $subscriber->is_active
                ? 'Feliratkozó sikeresen aktiválva.'
                : 'Feliratkozó sikeresen deaktiválva.'
        ]);
    }
    public function index()
    {
        $subscribers = NewsletterSubscriber::orderBy('created_at', 'desc')->paginate(15);

        return response()->json($subscribers);
    }
    public function destroy($id)
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);
        $subscriber->delete();

        return response()->json([
            'success' => true,
            'message' => 'Feliratkozó sikeresen törölve.'
        ]);
    }
}