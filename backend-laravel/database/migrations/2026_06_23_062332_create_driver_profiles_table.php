<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('driver_profiles', function (Blueprint $table) {
            $table->id();
            // identifiers
            $table->string('driver_id');
            $table->string('driver_name');
            $table->date('date');
            $table->string('route_id')->nullable();
            $table->string('vehicle_id')->nullable();
            $table->string('shift')->nullable();

            // raw telematics
            $table->decimal('trip_distance', 5, 1)->default(0);
            $table->integer('trip_duration')->default(0);
            $table->decimal('speed', 5, 1)->default(0);
            $table->integer('braking_events')->default(0);
            $table->integer('harsh_turns')->default(0);

            // engineered features
            $table->integer('delays_minutes')->default(0);
            $table->integer('behavioral_problems')->default(0);
            $table->integer('speeding')->default(0);
            $table->integer('violations_count')->default(0);
            $table->integer('aggressive_incidents_count')->default(0);
            $table->decimal('rating', 3, 2);

            $table->timestamps();
            $table->index('driver_id');
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_profiles');
    }
};
