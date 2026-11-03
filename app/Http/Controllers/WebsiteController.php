<?php

namespace App\Http\Controllers;

use App\Models\Website;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WebsiteController extends Controller
{
    public function index()
    {
        $websites = Website::with('creator:id,name')
            ->latest()
            ->get()
            ->map(fn ($website) => [
                'id' => $website->id,
                'name' => $website->name,
                'dfid' => $website->dfid,
                'url' => $website->url,
                'category' => $website->category,
                'description' => $website->description,
                'created_by' => $website->creator?->name ?? 'Unknown',
            ]);

        return Inertia::render('websites/index', [
            'websites' => $websites,
            'can' => [
                'create' => auth()->user()->can('website.create'),
                'edit' => auth()->user()->can('website.edit'),
                'delete' => auth()->user()->can('website.delete'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'dfid' => ['required', 'string', 'max:255', 'unique:websites,dfid'],
            'url' => ['required', 'url', 'max:2048', 'unique:websites,url'],
            'category' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        $validated['created_by'] = $request->user()->id;

        Website::create($validated);

        return to_route('websites.index')
            ->with('success', 'Website created successfully.');
    }

    public function update(Request $request, Website $website)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'dfid' => [
                'required',
                'string',
                'max:255',
                Rule::unique('websites', 'dfid')->ignore($website->id),
            ],
            'url' => [
                'required',
                'url',
                'max:2048',
                Rule::unique('websites', 'url')->ignore($website->id),
            ],
            'category' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        $website->update($validated);

        return to_route('websites.index')
            ->with('success', 'Website updated successfully.');
    }

    public function destroy(Website $website)
    {
        $website->delete();

        return to_route('websites.index')
            ->with('success', 'Website deleted successfully.');
    }
}
