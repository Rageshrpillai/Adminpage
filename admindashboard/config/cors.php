<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Configured for admindashboard.test backend with React frontend
    |
    */

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register',
        'password/*',
        'email/*',
        'user/profile-information',
        'user/password',
        'user/two-factor-authentication',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',    // React dev server (HTTP)
        'https://localhost:5173',   // React dev server (HTTPS)
        'http://127.0.0.1:5173',   // Alternative localhost
        'https://127.0.0.1:5173',  // Alternative localhost HTTPS
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Must be true for Sanctum cookie auth
    'supports_credentials' => true,
];
