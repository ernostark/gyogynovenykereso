<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'password' => 'required|min:8'
        ];
    }

    public function messages()
    {
        return [
            'email.required' => 'Az email mező kitöltése kötelező!',
            'email.email' => 'Kérjük, érvényes email címet adjon meg!',
            'password.required' => 'A jelszó megadása kötelező!',
            'password.min' => 'A jelszónak legalább 8 karakter hosszúnak kell lennie!'
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        throw new \Illuminate\Validation\ValidationException(
            $validator,
            response()->json([
                'success' => false,
                'message' => 'Adatbeviteli hiba!',
                'error' => $validator->errors()
            ], 422)
        );
    }
}
