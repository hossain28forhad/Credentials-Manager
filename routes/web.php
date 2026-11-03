<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\WebsiteController;
use App\Http\Controllers\CredentialController;
use App\Http\Controllers\CredentialActivityController;
use App\Http\Controllers\DashboardController;


Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('can:dashboard.view')
        ->name('dashboard');

    Route::middleware('can:manager.view')->group(function () {
        Route::get('/managers', [ManagerController::class, 'index'])
            ->name('managers.index');
    });

    Route::middleware('can:manager.create')->group(function () {
        Route::post('/managers', [ManagerController::class, 'store'])
            ->name('managers.store');
    });

    Route::middleware('can:manager.edit')->group(function () {
        Route::put('/managers/{manager}', [ManagerController::class, 'update'])
            ->name('managers.update');
    });

    Route::middleware('can:manager.delete')->group(function () {
        Route::delete('/managers/{manager}', [ManagerController::class, 'destroy'])
            ->name('managers.destroy');
    });


    // Website Management
    Route::middleware('can:website.view')->group(function () {
        Route::get('/websites', [WebsiteController::class, 'index'])
            ->name('websites.index');
    });

    Route::middleware('can:website.create')->group(function () {
        Route::post('/websites', [WebsiteController::class, 'store'])
            ->name('websites.store');
    });

    Route::middleware('can:website.edit')->group(function () {
        Route::put('/websites/{website}', [WebsiteController::class, 'update'])
            ->name('websites.update');
    });

    Route::middleware('can:website.delete')->group(function () {
        Route::delete('/websites/{website}', [WebsiteController::class, 'destroy'])
            ->name('websites.destroy');
    });

    // Credential Management
    Route::middleware('can:credential.view')->group(function () {
        Route::get('/credentials', [CredentialController::class, 'index'])
            ->name('credentials.index');
    });

    Route::middleware('can:credential.create')->group(function () {
        Route::post('/credentials', [CredentialController::class, 'store'])
            ->name('credentials.store');
    });

    Route::middleware('can:credential.edit')->group(function () {
        Route::put('/credentials/{credential}', [CredentialController::class, 'update'])
            ->name('credentials.update');
    });

    Route::middleware('can:credential.delete')->group(function () {
        Route::delete('/credentials/{credential}', [CredentialController::class, 'destroy'])
            ->name('credentials.destroy');
    });

    Route::middleware('can:credential.password.view')->group(function () {
        Route::get('/credentials/{credential}/password', [
            CredentialController::class,
            'showPassword',
        ])->name('credentials.password');
    });

    Route::middleware('can:activity.view')->group(function () {
        Route::get('/activity-logs', [
            CredentialActivityController::class,
            'index',
        ])->name('activity-logs.index');
    });
    
    // Export activity logs
    Route::get('/activity-logs/export', [
        CredentialActivityController::class,
        'export',
    ])->middleware('can:activity.view')->name('activity-logs.export');

});

require __DIR__ . '/settings.php';
