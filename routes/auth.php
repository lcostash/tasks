<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\OtpController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('login', [OtpController::class, 'showLoginForm'])
        ->name('login');

    Route::post('otp/send', [OtpController::class, 'sendOtp'])
        ->name('otp.send');

    Route::get('otp/verify', [OtpController::class, 'showVerifyForm'])
        ->name('otp.verify.form');

    Route::post('otp/verify', [OtpController::class, 'verifyOtp'])
        ->name('otp.verify');

    Route::post('otp/resend', [OtpController::class, 'resendOtp'])
        ->name('otp.resend');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
