<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('livestreams', function (Blueprint $table) {
            $table->json('team_one_squad')->nullable()->after('team_one_secondary_color');
            $table->json('team_two_squad')->nullable()->after('team_two_secondary_color');
        });
    }

    public function down(): void
    {
        Schema::table('livestreams', function (Blueprint $table) {
            $table->dropColumn(['team_one_squad', 'team_two_squad']);
        });
    }
};
