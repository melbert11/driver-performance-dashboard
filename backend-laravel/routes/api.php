<?php

use App\Http\Controllers\DriverMetricsController;

Route::prefix('metrics')->group(function () {
    Route::get('/weekly',          [DriverMetricsController::class, 'weeklySummary']);
    Route::get('/drivers',         [DriverMetricsController::class, 'driverProfiles']);
    Route::get('/drivers/{id}',    [DriverMetricsController::class, 'driverDetail']);
    Route::get('/shift',           [DriverMetricsController::class, 'byShift']);
});

Route::get('/drivers',             [DriverMetricsController::class, 'driverList']);