<?php

namespace App\Http\Controllers;

use App\Models\Website;
use App\Models\Credential;
use App\Models\CredentialActivity;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'totalManagers' => User::role('manager')->count(),
                'totalWebsites' => Website::count(),
                'totalCredentials' => Credential::count(),
                'totalActivities' => CredentialActivity::count(),
            ],

            'role' => auth()->user()->getRoleNames()->first() ?? 'User',

            'recentActivities' => CredentialActivity::with([
                'user:id,name',
                'credential:id,title,website_id',
                'credential.website:id,name',
            ])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($activity) => [
                    'id' => $activity->id,
                    'user' => $activity->user?->name ?? 'Deleted User',
                    'action' => $activity->action ?? 'unknown',
                    'credential' => $activity->credential_title
                        ?? $activity->credential?->title
                        ?? 'Deleted Credential',

                    'website' => $activity->website_name
                        ?? $activity->credential?->website?->name
                        ?? 'Deleted Website',
                    'date' => $activity->created_at?->format('d M Y, h:i A'),
                ]),
        ]);
    }
}
