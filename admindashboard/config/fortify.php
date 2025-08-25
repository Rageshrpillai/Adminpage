<?php

use Laravel\Fortify\Features;

return [

    /*
    |--------------------------------------------------------------------------
    | Fortify Guard
    |--------------------------------------------------------------------------
    |
    | Fortify uses the "web" guard because SPA authentication relies on
    | cookies + sessions (via Sanctum). API routes will then be protected
    | with the auth:sanctum middleware.
    |
    */

    'guard' => 'web',

    /*
    |--------------------------------------------------------------------------
    | Password Broker
    |--------------------------------------------------------------------------
    |
    | Defines which password broker Fortify should use. This should match
    | the "users" broker inside config/auth.php.
    |
    */

    'passwords' => 'users',

    /*
    |--------------------------------------------------------------------------
    | Username / Email
    |--------------------------------------------------------------------------
    |
    | Login will be handled using email. You could swap this to "username"
    | if your users log in with usernames.
    |
    */

    'username' => 'email',
    'email' => 'email',

    /*
    |--------------------------------------------------------------------------
    | Lowercase Usernames
    |--------------------------------------------------------------------------
    |
    | Ensures emails/usernames are always stored in lowercase so login is
    | case-insensitive.
    |
    */

    'lowercase_usernames' => true,

    /*
    |--------------------------------------------------------------------------
    | Home Path
    |--------------------------------------------------------------------------
    |
    | Not really used in an SPA since redirects are handled on frontend.
    | We set a default anyway for safety.
    |
    */

    'home' => '/',

    /*
    |--------------------------------------------------------------------------
    | Route Prefix / Domain
    |--------------------------------------------------------------------------
    |
    | Since we're using an SPA, we’ll let Fortify register routes at the root.
    | Frontend will hit endpoints like /login, /logout, /register via AJAX.
    |
    */

    'prefix' => '',
    'domain' => null,

    /*
    |--------------------------------------------------------------------------
    | Middleware
    |--------------------------------------------------------------------------
    |
    | All Fortify routes (login, register, password reset) will run in the
    | "web" middleware group since they rely on sessions/cookies.
    |
    */

    'middleware' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Prevent brute force attacks by throttling login and 2FA attempts.
    |
    */

    'limiters' => [
        'login' => 'login',
        'two-factor' => 'two-factor',
    ],

    /*
    |--------------------------------------------------------------------------
    | Views
    |--------------------------------------------------------------------------
    |
    | We disable Fortify’s Blade views because you’re using React SPA.
    | The frontend will handle rendering, backend only provides JSON APIs.
    |
    */

    'views' => false,

    /*
    |--------------------------------------------------------------------------
    | Features
    |--------------------------------------------------------------------------
    |
    | Enable only the features your project needs. This keeps things clean
    | and reduces unnecessary endpoints.
    |
    */

    'features' => [
        Features::registration(),                // SPA will handle user signup
        Features::resetPasswords(),              // Forgot password flow
        // Features::emailVerification(),        // Enable if required later
        Features::updateProfileInformation(),    // Update user info via API
        Features::updatePasswords(),             // Change password
        Features::twoFactorAuthentication([      // Optional: 2FA for extra security
            'confirm' => true,
            'confirmPassword' => true,
        ]),
    ],
];
