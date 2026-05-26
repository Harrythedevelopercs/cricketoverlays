<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LivestreamBall extends Model
{
    protected $fillable = [
        'livestream_id',
        'match_id',
        'club_id',
        'innings_number',
        'innings_key',
        'team_id',
        'team_name',
        'over_number',
        'ball_number',
        'delivery_key',
        'runs',
        'runs_display',
        'ball_type',
        'striker_id',
        'bowler_id',
        'commentary',
        'raw_data',
    ];

    protected $casts = [
        'raw_data' => 'array',
    ];
}
