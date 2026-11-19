<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')
            ->whereDoesntHave('roles', function ($query) {
                $query->where('name', 'super-admin');
            })
            ->latest()
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'role' => $user->roles->pluck('name')->first(),
                'emailVerified' => ! is_null($user->email_verified_at),
                'createdAt' => $user->created_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    public function approve(User $user)
    {
        abort_if($user->hasRole('super-admin'), 404);

        $user->update([
            'status' => 'active',
        ]);

        return to_route('users.index')
            ->with('success', 'User approved successfully.');
    }

    public function reject(User $user)
    {
        abort_if($user->hasRole('super-admin'), 404);

        $user->update([
            'status' => 'rejected',
        ]);

        return to_route('users.index')
            ->with('success', 'User rejected successfully.');
    }

    public function suspend(User $user)
    {
        abort_if($user->hasRole('super-admin'), 404);

        $user->update([
            'status' => 'suspended',
        ]);

        DB::table('sessions')
            ->where('user_id', $user->id)
            ->delete();

        return to_route('users.index')
            ->with('success', 'User suspended successfully.');
    }

    public function activate(User $user)
    {
        abort_if($user->hasRole('super-admin'), 404);

        $user->update([
            'status' => 'active',
        ]);

        return to_route('users.index')
            ->with('success', 'User activated successfully.');
    }
}
