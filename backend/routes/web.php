<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\NewsletterController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/admin/login', [AdminAuthController::class, 'showLoginForm'])->name('login');
Route::post('/admin/login', [AdminAuthController::class, 'login'])->name('admin.login');
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

Route::get('/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribeWithToken'])
    ->name('newsletter.unsubscribe');