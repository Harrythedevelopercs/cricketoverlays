<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('livestreams', function (Blueprint $table) {
            $table->string('scorebar_style')->default('classic')->after('match_type');
        });
    }

    public function down(): void
    {
        Schema::table('livestreams', function (Blueprint $table) {
            $table->dropColumn('scorebar_style');
        });
    }
};
