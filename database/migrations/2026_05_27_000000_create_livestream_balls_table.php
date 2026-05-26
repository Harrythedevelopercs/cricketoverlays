<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('livestream_balls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('livestream_id')->constrained('livestreams')->cascadeOnDelete();
            $table->unsignedBigInteger('match_id')->nullable();
            $table->unsignedBigInteger('club_id')->nullable();
            $table->unsignedTinyInteger('innings_number')->nullable();
            $table->string('innings_key')->nullable();
            $table->unsignedBigInteger('team_id')->nullable();
            $table->string('team_name')->nullable();
            $table->unsignedInteger('over_number')->nullable();
            $table->unsignedInteger('ball_number')->nullable();
            $table->string('delivery_key')->unique();
            $table->integer('runs')->nullable();
            $table->string('runs_display')->nullable();
            $table->string('ball_type')->nullable();
            $table->unsignedBigInteger('striker_id')->nullable();
            $table->unsignedBigInteger('bowler_id')->nullable();
            $table->text('commentary')->nullable();
            $table->json('raw_data');
            $table->timestamps();

            $table->index(['livestream_id', 'innings_number', 'over_number', 'ball_number']);
            $table->index(['match_id', 'club_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('livestream_balls');
    }
};
