<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'cricclubs' => [
        'base_url' => env('CRICCLUBS_BASE_URL', 'https://core-prod-origin.cricclubs.com/core'),
        'consumer_key' => env('CRICCLUBS_CONSUMER_KEY', '23June^MWCC'),
        'api_key' => env('CRICCLUBS_API_KEY', 'MWCC^25'),
        'auth_token' => env('CRICCLUBS_AUTH_TOKEN', '261bc5dc-b1b1-4d2a-bb3c-9c212d942025'),
        'association' => env('CRICCLUBS_ASSOCIATION', 'mwcc'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
