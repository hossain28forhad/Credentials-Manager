<?php

namespace App\Http\Controllers;

use App\Models\CredentialActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CredentialActivityController extends Controller
{
    public function index(Request $request)
    {
        // Permission check
        abort_unless($request->user()->can('activity.view'), 403);

        $query = CredentialActivity::with([
            'user:id,name,email',
            'credential:id,title,website_id',
            'credential.website:id,name',
        ])->latest();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })->orWhere(function ($credentialQuery) use ($search) {
                    $credentialQuery
                        ->where('credential_title', 'like', "%{$search}%")
                        ->orWhereHas('credential', function ($q) use ($search) {
                            $q->where('title', 'like', "%{$search}%");
                        });
                });
            });
        }

        // Date filter
        if ($request->filled('from_date')) {
            $request->validate([
                'from_date' => ['date'],
            ]);

            $query->whereDate('created_at', '>=', $request->input('from_date'));
        }

        if ($request->filled('to_date')) {
            $request->validate([
                'to_date' => ['date'],
            ]);

            $query->whereDate('created_at', '<=', $request->input('to_date'));
        }

        // Action filter
        if ($request->filled('action')) {
            $request->validate([
                'action' => [
                    'in:created,updated,deleted,password_viewed,unauthorized_access',
                ],
            ]);

            $query->where('action', $request->input('action'));
        }

        // Pagination and response
        $activities = $query->paginate(10)
            ->withQueryString()
            ->through(function ($activity) {
                return [
                    'id' => $activity->id,
                    'user_name' => $activity->user?->name ?? 'Deleted User',
                    'user_email' => $activity->user?->email,

                    'credential_title' => $activity->credential_title
                        ?? $activity->credential?->title
                        ?? 'Deleted Credential',

                    'website_name' => $activity->website_name
                        ?? $activity->credential?->website?->name
                        ?? 'Deleted Website',

                    'action' => $activity->action,
                    'ip_address' => $activity->ip_address,
                    'created_at' => $activity->created_at?->format('d M Y, h:i A'),
                    'metadata' => $activity->metadata,
                ];
            });

        return Inertia::render('activity-logs/index', [
            'activities' => $activities,
        ]);
    }



public function export(Request $request)
{
    abort_unless($request->user()->can('activity.view'), 403);

    $request->validate([
        'search' => ['nullable', 'string', 'max:255'],
        'action' => [
            'nullable',
            'in:created,updated,deleted,password_viewed,unauthorized_access',
        ],
        'from_date' => ['nullable', 'date'],
        'to_date' => ['nullable', 'date', 'after_or_equal:from_date'],
    ]);

    $query = CredentialActivity::query()
        ->with([
            'user:id,name,email',
            'credential:id,title,website_id',
            'credential.website:id,name',
        ]);

    // Search
    if ($request->filled('search')) {
        $search = $request->input('search');

        $query->where(function ($q) use ($search) {
            $q->whereHas('user', function ($userQuery) use ($search) {
                $userQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })->orWhere(function ($credentialQuery) use ($search) {
                $credentialQuery->where('credential_title', 'like', "%{$search}%")
                    ->orWhereHas('credential', function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%");
                    });
            });
        });
    }

    // Action filter
    if ($request->filled('action')) {
        $query->where('action', $request->input('action'));
    }

    // Date filters
    if ($request->filled('from_date')) {
        $query->whereDate('created_at', '>=', $request->input('from_date'));
    }

    if ($request->filled('to_date')) {
        $query->whereDate('created_at', '<=', $request->input('to_date'));
    }

    $fileName = 'activity-logs-' . now()->format('Y-m-d-His') . '.csv';

    return response()->streamDownload(function () use ($query) {
        $output = fopen('php://output', 'w');

        // UTF-8 BOM for Excel
        fwrite($output, "\xEF\xBB\xBF");

        // Prevent CSV Formula Injection
        $safe = function ($value) {
            $value = (string) ($value ?? '');

            if (preg_match('/^[\s\x00-\x1F]*[=+\-@]/', $value)) {
                return "'" . $value;
            }

            return $value;
        };

        fputcsv($output, [
            'ID',
            'User',
            'Email',
            'Action',
            'Credential',
            'Website',
            'IP Address',
            'Date & Time',
            'Route',
            'URL',
            'Method',
            'Required Permissions',
        ]);

        // Process 500 records at a time
        $query->chunkById(500, function ($activities) use ($output, $safe) {
            foreach ($activities as $activity) {
                $metadata = $activity->metadata ?? [];

                fputcsv($output, [
                    $activity->id,
                    $safe($activity->user?->name ?? 'Deleted User'),
                    $safe($activity->user?->email),
                    $safe($activity->action),
                    $safe(
                        $activity->credential_title
                        ?? $activity->credential?->title
                        ?? 'Deleted Credential'
                    ),
                    $safe(
                        $activity->website_name
                        ?? $activity->credential?->website?->name
                        ?? 'Deleted Website'
                    ),
                    $safe($activity->ip_address),
                    $safe($activity->created_at?->format('Y-m-d H:i:s')),
                    $safe($metadata['route'] ?? ''),
                    $safe($metadata['url'] ?? ''),
                    $safe($metadata['method'] ?? ''),
                    $safe(implode(', ', $metadata['required_permissions'] ?? [])),
                ]);
            }
        });

        fclose($output);
    }, $fileName, [
        'Content-Type' => 'text/csv; charset=UTF-8',
        'Cache-Control' => 'no-store, private',
    ]);
}

}
