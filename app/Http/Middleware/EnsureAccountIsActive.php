<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccountIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        if ($user->status === 'pending') {
            return redirect()->route('account.pending');
        }

        if ($user->status !== 'active') {
            abort(403, 'Your account is not active.');
        }

        return $next($request);
    }
}
