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
        Schema::create('livestreams', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->string('live_stream_id')->unique();
            $table->string('live_stream_url');

            $table->string('primary_color')->nullable();
            $table->string('secondary_color')->nullable();

            $table->unsignedBigInteger('match_id')->nullable();
            $table->unsignedBigInteger('club_id')->nullable();
            $table->string('match_type')->nullable();

            // Team One
            $table->string('team_one_title');
            $table->unsignedBigInteger('team_one_id');
            $table->string('team_one_logo')->nullable();
            $table->string('team_one_primary_color')->nullable();
            $table->string('team_one_secondary_color')->nullable();

            // Team Two
            $table->string('team_two_title');
            $table->unsignedBigInteger('team_two_id');
            $table->string('team_two_logo')->nullable();
            $table->string('team_two_primary_color')->nullable();
            $table->string('team_two_secondary_color')->nullable();

            // Match Info
            $table->timestamp('match_start_time')->nullable();
            $table->timestamp('match_end_time')->nullable();
            $table->string('match_status')->nullable();
            $table->string('match_result')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('livestreams');
    }
};
