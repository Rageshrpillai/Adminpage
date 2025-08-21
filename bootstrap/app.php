<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Laravel\Fortify\FortifyServiceProvider;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 🔹 Apply global CORS middleware (reads settings from config/cors.php)
        $middleware->append(HandleCors::class);

        // 🔹 Sanctum middleware for SPA authentication with cookies
        $middleware->api(prepend: [
            EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // 🔹 Example: render validation errors as JSON
        $exceptions->render(function (Illuminate\Validation\ValidationException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        // 🔹 Example: render model not found as JSON
        $exceptions->render(function (Illuminate\Database\Eloquent\ModelNotFoundException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Resource not found',
                ], 404);
            }
        });

        // 🔹 Catch-all fallback for unexpected errors
        // $exceptions->render(function (Throwable $e, $request) {
        //     if ($request->expectsJson()) {
        //         return response()->json([
        //             'message' => 'Something went wrong, please try again later',
        //         ], 500);
        //     }
        // });
    })
    ->withProviders([
        FortifyServiceProvider::class, // ✅ Register Fortify here
    ])
    ->create();
