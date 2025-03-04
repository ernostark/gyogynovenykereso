<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (
            Auth::guard('admin')->check() ||
            (Auth::guard('sanctum')->check() && Auth::guard('sanctum')->user()->is_admin)
        ) {
            return $next($request);
        }

        return response()->json(['message' => 'Hozzáférés megtagadva!'], 403);
    }
}
