<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CredentialActivity extends Model
{
    protected $fillable = [
        'credential_id',
        'user_id',
        'action',
        'ip_address',
        'user_agent',
        'metadata',
        'credential_title',
        'website_name',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    public function credential(): BelongsTo
    {
        return $this->belongsTo(Credential::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
