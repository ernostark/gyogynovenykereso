<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\RateLimiter;

class PasswordResetController extends Controller
{
    /**
     * Jelszó-visszaállítási link küldése
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Nem található felhasználó ezzel az e-mail címmel.'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $throttleKey = Str::lower($request->input('email')) . '|' . $request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'message' => 'Túl sok kísérlet. Próbáld újra ' . $seconds . ' másodperc múlva.'
            ], 429);
        }

        RateLimiter::hit($throttleKey, 3600);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Jelszó-visszaállítási email elküldve.'])
            : response()->json(['message' => __($status)], 500);
    }

    /**
     * Jelszó visszaállítása a kapott tokennel
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => [
                'required',
                'confirmed',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/'
            ],
        ], [
            'password.regex' => 'A jelszónak tartalmaznia kell nagybetűt, kisbetűt és számot.'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Jelszó sikeresen visszaállítva.'])
            : response()->json(['message' => __($status)], 400);
    }
}