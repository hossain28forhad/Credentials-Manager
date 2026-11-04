<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

use App\Models\LoginActivity;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Logout;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Event;
use Throwable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();


        Event::listen(Login::class, function (Login $event) {
            try {
                LoginActivity::create([
                    'user_id' => $event->user->getAuthIdentifier(),
                    'email' => $event->user->email ?? null,
                    'action' => 'login',
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'metadata' => [
                        'guard' => $event->guard,
                    ],
                ]);
            } catch (Throwable $e) {
                report($e);
            }
        });

        Event::listen(Failed::class, function (Failed $event) {
            try {
                $email = $event->credentials['email']
                    ?? $event->credentials['username']
                    ?? null;

                LoginActivity::create([
                    'user_id' => $event->user?->getAuthIdentifier(),
                    'email' => $event->user?->email ?? $email,
                    'action' => 'failed_login',
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'metadata' => [
                        'guard' => $event->guard,
                    ],
                ]);
            } catch (Throwable $e) {
                report($e);
            }
        });

        Event::listen(Logout::class, function (Logout $event) {
            try {
                LoginActivity::create([
                    'user_id' => $event->user?->getAuthIdentifier(),
                    'email' => $event->user?->email ?? null,
                    'action' => 'logout',
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'metadata' => [
                        'guard' => $event->guard,
                    ],
                ]);
            } catch (Throwable $e) {
                report($e);
            }
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn(): ?Password => app()->isProduction()
                ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
                : null,
        );
    }
}
