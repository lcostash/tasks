<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Carbon\Carbon;

class OtpController extends Controller
{
    /**
     * Display the OTP login form.
     */
    public function showLoginForm()
    {
        return Inertia::render('Auth/OtpLogin');
    }

    /**
     * Send OTP code to the email address.
     */
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $email = $request->email;
        $code = OtpCode::generateCode();
        
        // Create OTP code (expires in 10 minutes)
        OtpCode::create([
            'email' => $email,
            'code' => $code,
            'expires_at' => Carbon::now()->addMinutes(10),
        ]);

        // Send email with OTP code
        Mail::raw("Your OTP code is: {$code}\n\nThis code will expire in 10 minutes.", function ($message) use ($email) {
            $message->to($email)
                    ->subject('Your Login Code');
        });

        return redirect()->route('otp.verify.form')->with([
            'email' => $email,
            'message' => 'OTP code has been sent to your email.',
        ]);
    }

    /**
     * Display the OTP verification form.
     */
    public function showVerifyForm()
    {
        if (!session('email')) {
            return redirect()->route('otp.login');
        }

        return Inertia::render('Auth/OtpVerify', [
            'email' => session('email'),
        ]);
    }

    /**
     * Verify the OTP code and log in the user.
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages([
                'code' => ['The provided code is invalid.'],
            ]);
        }

        $email = $request->email;
        $code = $request->code;

        // Find valid OTP code
        $otpCode = OtpCode::where('email', $email)
            ->where('code', $code)
            ->valid()
            ->latest()
            ->first();

        if (!$otpCode) {
            throw ValidationException::withMessages([
                'code' => ['The provided code is invalid or has expired.'],
            ]);
        }

        // Mark OTP as used
        $otpCode->markAsUsed();

        // Find or create user
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $user = User::create([
                'email' => $email,
                'name' => explode('@', $email)[0], // Use email username as default name
                'password' => bcrypt(str()->random(32)), // Random password (not used)
                'role' => 'user',
                'email_verified_at' => Carbon::now(),
            ]);
        }

        // Log in the user
        Auth::login($user, true);

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Resend OTP code.
     */
    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        return $this->sendOtp($request);
    }
}


