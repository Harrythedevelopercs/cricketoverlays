<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Livestream extends Model
{
    use HasFactory;

    protected $table = 'livestreams';

    protected $fillable = [
        'title',
        'live_stream_id',
        'live_stream_url',

        'primary_color',
        'secondary_color',

        'match_id',
        'club_id',
        'match_type',

        // Team One
        'team_one_title',
        'team_one_id',
        'team_one_logo',
        'team_one_primary_color',
        'team_one_secondary_color',
        'team_one_squad',

        // Team Two
        'team_two_title',
        'team_two_id',
        'team_two_logo',
        'team_two_primary_color',
        'team_two_secondary_color',
        'team_two_squad',

        'match_start_time',
        'match_end_time',
        'match_status',
        'match_result',
    ];

    protected $casts = [
        'match_start_time' => 'datetime',
        'match_end_time' => 'datetime',
        'team_one_squad' => 'array',
        'team_two_squad' => 'array',
    ];
}
