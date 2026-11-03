<?php

namespace App\Http\Controllers;

use App\Models\CredentialActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CredentialActivityController extends Controller
{

    public function index(Request $request)
    {
        $query = CredentialActivity::with([
            'user:id,name,email',
            'credential:id,title,website_id',
            'credential.website:id,name',
        ])->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })->orWhereHas('credential', function ($credentialQuery) use ($search) {
                    $credentialQuery->where('title', 'like', "%{$search}%");
                });
            });
        }

        if ($request->filled('action')) {
            $request->validate([
                'action' => [
                    'in:created,updated,deleted,password_viewed',
                ],
            ]);

            $query->where('action', $request->input('action'));
        }

        $activities = $query->paginate(15)
            ->withQueryString()
            ->through(function ($activity) {
                return [
                    'id' => $activity->id,
                    'user_name' => $activity->user?->name ?? 'Deleted User',
                    'user_email' => $activity->user?->email,
                    'credential_title' => $activity->credential?->title ?? 'Deleted Credential',
                    'website_name' => $activity->credential?->website?->name ?? 'Deleted Website',
                    'action' => $activity->action,
                    'ip_address' => $activity->ip_address,
                    'created_at' => $activity->created_at?->format('d M Y, h:i A'),
                ];
            });

        return Inertia::render('activity-logs/index', [
            'activities' => $activities,
        ]);
    }
}
