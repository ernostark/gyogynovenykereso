<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\UpdateUserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Carbon\Carbon;

class UserController extends Controller
{
    public function register(RegisterUserRequest $request)
    {
        try {
            $request->validated();

            $user = User::create([
                "name" => $request["name"],
                "email" => $request["email"],
                "password" => bcrypt($request["password"])
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Sikeres regisztráció!',
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba történt a regisztráció során.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function login(LoginUserRequest $request)
    {
        $request->validated();

        if (!Auth::attempt(['email' => $request['email'], 'password' => $request['password']])) {
            return response()->json(['message' => 'Helytelen email vagy jelszó!'], 401);
        }

        $user = $request->user();
        $expiresAt = Carbon::now()->addDay();

        if ($user->is_admin) {
            $token = $user->createToken('admin_token', ['*'], $expiresAt)->plainTextToken;
            $tokenType = 'admin_token';
        } else {
            $token = $user->createToken('auth_token', ['*'], $expiresAt)->plainTextToken;
            $tokenType = 'auth_token';
        }

        return response()->json([
            'message' => 'Sikeres bejelentkezés!',
            'user' => $user,
            'token' => $token,
            'tokenType' => $tokenType
        ], 200);
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Sikeresen kijelentkeztél!',
        ]);
    }
    public function updateProfile(UpdateUserProfile $request)
    {
        try {
            $user = $request->user();
            $data = $request->validated();

            if (isset($data['password']) && !empty($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            } else {
                unset($data['password_confirmation']);
                unset($data['password']);
            }

            $user->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Profil sikeresen frissítve!',
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba történt a profil frissítése során!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getProfile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => [
                'country' => $user->country,
                'postal_code' => $user->postal_code,
                'city' => $user->city,
                'street' => $user->street,
                'address_line_2' => $user->address_line_2
            ],
        ]);
    }
    public function index()
    {
        try {
            $users = User::select(
                'id',
                'name',
                'email',
                'created_at',
                'updated_at',
                'country',
                'postal_code',
                'city',
                'street',
                'address_line_2',
                'is_admin'
            )->get();

            return response()->json([
                'success' => true,
                'users' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba történt a felhasználók lekérése során',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function toggleAdminStatus($userId)
    {
        $user = User::findOrFail($userId);
        $user->is_admin = !$user->is_admin;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Admin jogosultság módosítva!'
        ]);
    }
}
