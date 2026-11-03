<?php

namespace App\Http\Controllers;

use App\Models\Credential;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CredentialController extends Controller
{
    public function index()
    {
        $credentials = Credential::with([
            'website:id,name,url',
            'creator:id,name',
        ])->latest()->get()->map(function ($credential) {
            return [
                'id' => $credential->id,
                'website_id' => $credential->website_id,
                'website_name' => $credential->website?->name,
                'title' => $credential->title,
                'username' => $credential->username,
                'email' => $credential->email,
                'login_url' => $credential->login_url,
                'notes' => $credential->notes,
                'created_by' => $credential->creator?->name,
            ];
        });

        return Inertia::render('credentials/index', [
            'credentials' => $credentials,
            'websites' => \App\Models\Website::select('id', 'name')->orderBy('name')->get(),
            'can' => [
                'create' => auth()->user()->can('credential.create'),
                'edit' => auth()->user()->can('credential.edit'),
                'delete' => auth()->user()->can('credential.delete'),
                'viewPassword' => auth()->user()->can('credential.password.view'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'website_id' => ['required', 'exists:websites,id'],
            'title' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:5000'],
            'email' => ['nullable', 'email', 'max:255'],
            'login_url' => ['nullable', 'url', 'max:2048'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $validated['created_by'] = $request->user()->id;

        Credential::create($validated);

        return back()->with('success', 'Credential created successfully.');
    }

    public function showPassword(Credential $credential)
    {
        return response()->json([
            'password' => $credential->password,
        ]);
    }

    public function update(Request $request, Credential $credential)
    {
        $validated = $request->validate([
            'website_id' => ['required', 'exists:websites,id'],
            'title' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'max:5000'],
            'email' => ['nullable', 'email', 'max:255'],
            'login_url' => ['nullable', 'url', 'max:2048'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);

        if (blank($validated['password'] ?? null)) {
            unset($validated['password']);
        }

        $credential->update($validated);

        return back()->with('success', 'Credential updated successfully.');
    }

    public function destroy(Credential $credential)
    {
        $credential->delete();

        return back()->with('success', 'Credential deleted successfully.');
    }
}
