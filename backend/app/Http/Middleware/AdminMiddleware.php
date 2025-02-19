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
            $path = $request->path();
            $method = $request->method();

            $superAdminRoutes = [
                'admin/users/*/delete' => ['DELETE'],
                'admin/users/*/toggle-admin' => ['POST'],
            ];

            foreach ($superAdminRoutes as $route => $methods) {
                if (fnmatch($route, $path) && in_array($method, $methods)) {
                    $user = Auth::guard('sanctum')->user();
                    $isSuperAdmin = \App\Models\Admin::where('email', $user->email)->exists();

                    if (!$isSuperAdmin) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Ehhez a művelethez szuperadmin jogosultság szükséges!'
                        ], 403);
                    }

                    break;
                }
            }

            return $next($request);
        }

        return response()->json(['message' => 'Hozzáférés megtagadva!'], 403);
    }
}
