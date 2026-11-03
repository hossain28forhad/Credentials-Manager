<?php

namespace App\Http\Middleware;

use App\Models\CredentialActivity;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class LogUnauthorizedAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $route = $request->route();

        $hasCanMiddleware = $route && collect($route->gatherMiddleware())
            ->contains(fn ($middleware) => str_starts_with($middleware, 'can:'));

        if (
            $response->getStatusCode() === 403 &&
            $hasCanMiddleware &&
            $request->user()
        ) {
            try {
                $permissions = collect($route->gatherMiddleware())
                    ->filter(fn ($middleware) => str_starts_with($middleware, 'can:'))
                    ->values()
                    ->all();

                CredentialActivity::create([
                    'credential_id' => null,
                    'user_id' => $request->user()->id,
                    'action' => 'unauthorized_access',
                    'credential_title' => null,
                    'website_name' => null,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'metadata' => [
                        'route' => $route->getName(),
                        'url' => $request->path(),
                        'method' => $request->method(),
                        'required_permissions' => $permissions,
                    ],
                ]);
            } catch (Throwable $exception) {
                report($exception);
            }
        }

        return $response;
    }
}