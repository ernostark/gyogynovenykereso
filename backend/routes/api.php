<?php

use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\ShippingMethodController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\StatisticsController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\User\OrderController;
use App\Http\Controllers\UserController;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\ShippingMethod;
use Illuminate\Support\Facades\Route;

Route::controller(UserController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/logout', 'logout')->middleware('auth:sanctum');
    Route::put('/profile', 'updateProfile')->middleware('auth:sanctum');
    Route::get('/getprofile', 'getProfile')->middleware('auth:sanctum');

    Route::get('/orders', [OrderController::class, 'index'])->middleware('auth:sanctum');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->middleware('auth:sanctum');
});

Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::controller(PostController::class)->group(function () {
        Route::get('/posts', 'index');
        Route::get('/posts/{id}', 'show');
        Route::post('/posts', 'store');
        Route::post('/posts/{id}', 'update');
        Route::delete('/posts/{id}', 'destroy');
    });
    Route::controller(CategoryController::class)->group(function () {
        Route::get('/categories', 'index');
        Route::post('/categories', 'store');
        Route::delete('/categories/{id}', 'destroy');
    });
    Route::controller(ProductCategoryController::class)->group(function () {
        Route::post('/product-categories', 'store');
        Route::put('/product-categories/{id}', 'update');
        Route::delete('/product-categories/{id}', 'destroy');
    });
    Route::controller(ProductController::class)->group(function () {
        Route::post('/products', 'store');
        Route::post('/products/{id}', 'update');
        Route::delete('/products/{id}', 'destroy');
    });
    Route::controller(ContactController::class)->group(function () {
        Route::get('/messages', 'index');
        Route::put('/messages/{id}/read', 'markAsRead');
        Route::delete('/messages/{id}', 'destroy');
    });

    Route::controller(ShippingMethodController::class)->group(function () {
        Route::get('/shipping-methods', 'index');
        Route::post('/shipping-methods', 'store');
        Route::put('/shipping-methods/{id}', 'update');
        Route::delete('/shipping-methods/{id}', 'destroy');
        Route::put('/shipping-methods/{id}/toggle-active', 'toggleActive');
    });

    Route::controller(PaymentMethodController::class)->group(function () {
        Route::get('/payment-methods', 'index');
        Route::post('/payment-methods', 'store');
        Route::put('/payment-methods/{id}', 'update');
        Route::delete('/payment-methods/{id}', 'destroy');
        Route::put('/payment-methods/{id}/toggle-active', 'toggleActive');
    });

    Route::controller(AdminOrderController::class)->group(function () {
        Route::get('/orders', 'index');
        Route::get('/orders/{id}', 'show');
        Route::post('/orders/{id}/status', 'updateStatus');
        Route::get('/order-statuses', 'getStatuses');
    });

    Route::get('/check-super-admin', [UserController::class, 'checkSuperAdmin']);
    Route::post('/users/{userId}/toggle-admin', [UserController::class, 'toggleAdminStatus']);
    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::get('/newsletter/subscribers', [NewsletterController::class, 'index']);
    Route::delete('/newsletter/subscribers/{id}', [NewsletterController::class, 'destroy']);
    Route::post('/newsletter/subscribers/{id}/toggle-status', [NewsletterController::class, 'toggleStatus']);

    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{id}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.updateStatus');

    Route::get('/product-statistics', [StatisticsController::class, 'getProductStatistics']);
});

Route::get('posts/featured', [PostController::class, 'getFeaturedPosts']);
Route::get('posts/latest', [PostController::class, 'getLatestPosts']);
Route::post('posts/search-by-diseases', [PostController::class, 'searchByDiseases']);
Route::get('posts/search', [PostController::class, 'searchInContent']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::get('/posts/latest', [PostController::class, 'getLatestPosts']);
Route::get('/public-posts', [PostController::class, 'getPublicPosts']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}/posts', [CategoryController::class, 'getPosts']);

Route::post('/contact', [ContactController::class, 'store']);

Route::get('/product-categories', [ProductCategoryController::class, 'index']);
Route::get('/product-categories/{id}', [ProductCategoryController::class, 'show']);
Route::get('/product-categories/{id}/products', [ProductCategoryController::class, 'getProducts']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart/items', [CartController::class, 'addItem']);
Route::put('/cart/items/{id}', [CartController::class, 'updateItem']);
Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
Route::delete('/cart', [CartController::class, 'clear']);

Route::post('/checkout', [CheckoutController::class, 'checkout']);

Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

Route::get('/shipping-methods', function () {
    return ShippingMethod::where('is_active', true)
        ->orderBy('name')
        ->get();
});
Route::get('/payment-methods', function () {
    return PaymentMethod::where('is_active', true)
        ->orderBy('sort_order')
        ->orderBy('name')
        ->get();
});

Route::get('/order-statuses', function () {
    return OrderStatus::orderBy('sort_order')->get();
});