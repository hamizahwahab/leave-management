<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

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
        // Global Gate: Check permissions before any other authorization checks are made
        Gate::before(function (User $user, string $ability) {
            if ($user->hasPermission($ability)) {
                return true;
            }
        });
    }
}
