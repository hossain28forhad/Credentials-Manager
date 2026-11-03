<?php

namespace App\Http\Controllers;

use App\Models\Credential;
use App\Models\CredentialActivity;
use App\Models\Website;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CredentialController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(
            $request->user()->can('credential.view'),
            403
        );

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
            'websites' => Website::select('id', 'name')
                ->orderBy('name')
                ->get(),

            'can' => [
                'create' => $request->user()->can('credential.create'),
                'edit' => $request->user()->can('credential.edit'),
                'delete' => $request->user()->can('credential.delete'),
                'viewPassword' => $request->user()->can('credential.password.view'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        abort_unless(
            $request->user()->can('credential.create'),
            403
        );

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

        $credential = Credential::create($validated);

        $this->logActivity($request, $credential, 'created');

        return back()->with('success', 'Credential created successfully.');
    }

    public function showPassword(Request $request, Credential $credential)
    {
        abort_unless(
            $request->user()->can('credential.password.view'),
            403
        );

        $this->logActivity($request, $credential, 'password_viewed');

        return response()
            ->json([
                'password' => $credential->password,
            ])
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }

    public function update(Request $request, Credential $credential)
    {
        abort_unless(
            $request->user()->can('credential.edit'),
            403
        );

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

        $this->logActivity($request, $credential, 'updated');

        return back()->with('success', 'Credential updated successfully.');
    }

    public function destroy(Request $request, Credential $credential)
    {
        abort_unless(
            $request->user()->can('credential.delete'),
            403
        );

        $this->logActivity($request, $credential, 'deleted');

        $credential->delete();

        return back()->with('success', 'Credential deleted successfully.');
    }

    private function logActivity(
        Request $request,
        ?Credential $credential,
        string $action
    ): void {
        $credential?->loadMissing('website:id,name');

        CredentialActivity::create([
            'credential_id' => $credential?->id,
            'user_id' => $request->user()->id,
            'action' => $action,
            'credential_title' => $credential?->title,
            'website_name' => $credential?->website?->name,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
