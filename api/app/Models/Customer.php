<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'customers';

    /**
     * The attributes that are mass assignable.
     * Only these fields can be saved via create() or update()
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'contact_number',
    ];

    /**
     * The attributes that should be hidden from arrays/JSON.
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}