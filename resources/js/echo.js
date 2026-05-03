import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const reverbScheme =
    import.meta.env.VITE_REVERB_SCHEME ||
    (window.location.protocol === 'https:' ? 'https' : 'http');
const reverbPort = Number(
    import.meta.env.VITE_REVERB_PORT || (reverbScheme === 'https' ? 443 : 80),
);
const forceTLS = reverbScheme === 'https';

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'zmsfu2mphh19ibww52wr',
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS,
    encrypted: forceTLS,
    enabledTransports: [forceTLS ? 'wss' : 'ws'],
});

window.Echo = echo;

export default echo;
