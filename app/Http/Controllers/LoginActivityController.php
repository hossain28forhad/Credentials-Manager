<?php

namespace App\Http\Controllers;

use App\Models\LoginActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoginActivityController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(
            $request->user()->can('login-activity.view'),
            403
        );

        $query = LoginActivity::with('user:id,name,email')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('action')) {
            $request->validate([
                'action' => [
                    'in:login,failed_login,logout',
                ],
            ]);

            $query->where('action', $request->input('action'));
        }

        $activities = $query->paginate(15)
            ->withQueryString()
            ->through(fn ($activity) => [
                'id' => $activity->id,
                'user_name' => $activity->user?->name ?? 'Unknown User',
                'email' => $activity->email,
                'action' => $activity->action,
                'ip_address' => $activity->ip_address,
                'user_agent' => $activity->user_agent,
                'created_at' => $activity->created_at?->format('d M Y, h:i A'),
            ]);

        return Inertia::render('login-history/index', [
            'activities' => $activities,
            'stats' => [
                'total_login' => LoginActivity::where('action', 'login')->count(),
                'failed_login' => LoginActivity::where('action', 'failed_login')->count(),
                'total_logout' => LoginActivity::where('action', 'logout')->count(),
            ],
        ]);
    }
}
