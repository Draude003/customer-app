<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'first_name'     => ['required', 'string', 'max:255'],
            'last_name'      => ['required', 'string', 'max:255'],
            'email'          => ['required', 'string', 'email', 'max:255', 'unique:customers,email'],
            'contact_number' => ['required', 'string', 'max:20'],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'first_name.required'     => 'First name is required.',
            'last_name.required'      => 'Last name is required.',
            'email.required'          => 'Email address is required.',
            'email.email'             => 'Please provide a valid email address.',
            'email.unique'            => 'This email address is already taken.',
            'contact_number.required' => 'Contact number is required.',
        ];
    }
}