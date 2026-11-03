<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class ManagerController extends Controller
{
    private function assignablePermissions(): array
    {
        return Permission::where('guard_name', 'web')
            ->whereNotIn('name', [
                'manager.view',
                'manager.create',
                'manager.edit',
                'manager.delete',
            ])
            ->pluck('name')
            ->toArray();
    }

    public function index()
    {
        $managers = User::role('manager')
            ->with('permissions')
            ->latest()
            ->get()
            ->map(fn($manager) => [
                'id' => $manager->id,
                'name' => $manager->name,
                'email' => $manager->email,
                'permissions' => $manager->getDirectPermissions()
                    ->pluck('name'),
            ]);

        return Inertia::render('managers/index', [
            'managers' => $managers,
            'availablePermissions' => $this->assignablePermissions(),

            'can' => [
                'create' => auth()->user()->can('manager.create'),
                'edit' => auth()->user()->can('manager.edit'),
                'delete' => auth()->user()->can('manager.delete'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $available = $this->assignablePermissions();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', Rule::in($available)],
        ]);

        DB::transaction(function () use ($validated) {
            $manager = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'email_verified_at' => now(),
            ]);

            $manager->assignRole('manager');

            $manager->syncPermissions($validated['permissions'] ?? []);
        });

        return to_route('managers.index')
            ->with('success', 'Manager created successfully.');
    }

    public function update(Request $request, User $manager)
    {
        abort_unless($manager->hasRole('manager'), 404);

        $available = $this->assignablePermissions();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($manager->id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', Rule::in($available)],
        ]);

        DB::transaction(function () use ($manager, $validated) {
            $manager->name = $validated['name'];
            $manager->email = $validated['email'];

            if (!empty($validated['password'])) {
                $manager->password = Hash::make($validated['password']);
            }

            $manager->save();

            $manager->syncPermissions($validated['permissions'] ?? []);
        });

        return to_route('managers.index')
            ->with('success', 'Manager updated successfully.');
    }

    public function destroy(User $manager)
    {
        abort_unless($manager->hasRole('manager'), 404);

        $manager->delete();

        return to_route('managers.index')
            ->with('success', 'Manager deleted successfully.');
    }
}
