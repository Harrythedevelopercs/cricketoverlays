<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ScoreboardUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('livestream.'.$this->data['id']),
        ];
    }

    public function broadcastAs()
    {
        return 'ScoreboardUpdated';
    }

    public function broadcastWith()
    {
        return [
            'type' => $this->data['type'],
            'livestream' => $this->data['livestream'],
        ];
    }
}
