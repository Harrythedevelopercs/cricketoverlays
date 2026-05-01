import { useEffect, useState } from 'react';

const cricclubsImageUrl = (path?: string) => {
    if (!path) {
        return 'https://placehold.co/400x500/1a202c/white?text=PLAYER';
    }

    if (path.startsWith('http')) {
        return path;
    }

    return `https://media.cricclubs.com${path.startsWith('/') ? path : `/${path}`}`;
};

export default function BatsmanStatsOverlay({
    show,
    batsmanName,
    runs,
    balls,
    fours,
    sixes,
    strikeRate,
    batsmanImage,
    teamColor,
    onClose,
}: any) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            const timeout = window.setTimeout(() => setVisible(false), 500);

            return () => window.clearTimeout(timeout);
        }
    }, [show]);

    if (!visible) {
        return null;
    }

    const tColor = teamColor || '#ffb703';

    return (
        <div className="pointer-events-none fixed inset-0 z-[75] font-sans">
            <div
                className={`absolute top-1/2 left-16 flex h-[150px] w-[600px] -translate-y-1/2 transform transition-all duration-700 ${show ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
            >
                <div className="relative flex flex-1 flex-col overflow-hidden rounded-l-2xl border-y border-l border-gray-700/50 bg-gradient-to-r from-[#0f172a] to-[#1e293b] shadow-2xl">
                    <div
                        className="absolute top-0 left-0 h-1 w-full"
                        style={{ backgroundColor: tColor }}
                    />

                    <div className="flex items-center border-b border-white/10 bg-white/5 px-6 py-3">
                        <h2
                            className="z-10 text-2xl leading-tight font-black tracking-wider text-white uppercase"
                            style={{
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            }}
                        >
                            {batsmanName || 'Player Name'}
                        </h2>
                    </div>

                    <div className="flex flex-1 items-center justify-around bg-[#0a0f18]/50 px-4">
                        {[
                            ['Runs', runs ?? 0, 'text-4xl font-black text-white'],
                            ['Balls', balls ?? 0, 'text-2xl font-bold text-gray-200'],
                            ['4s', fours ?? 0, 'text-2xl font-bold text-gray-200'],
                            ['6s', sixes ?? 0, 'text-2xl font-bold text-gray-200'],
                            [
                                'SR',
                                strikeRate ?? '0.00',
                                'text-2xl font-bold text-[#ffb703]',
                            ],
                        ].map(([label, value, className]) => (
                            <div
                                key={label}
                                className="flex flex-col items-center"
                            >
                                <span className="mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                    {label}
                                </span>
                                <span className={`${className} drop-shadow-md`}>
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative flex h-full w-[180px] items-end overflow-visible">
                    <div
                        className="absolute inset-0 rounded-r-2xl border-y border-r border-gray-700/50 bg-gradient-to-br from-gray-800 to-black"
                        style={{
                            clipPath:
                                'polygon(0 0, 100% 0, 100% 100%, 20% 100%)',
                        }}
                    >
                        <div
                            className="absolute top-0 left-0 h-1 w-full"
                            style={{ backgroundColor: tColor }}
                        />
                    </div>
                    <img
                        src={cricclubsImageUrl(batsmanImage)}
                        className="relative z-10 h-[150%] w-full object-cover object-bottom drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
                        alt="Player"
                    />
                </div>

                <button
                    className="pointer-events-auto absolute top-2 right-2 z-20 h-7 w-7 rounded bg-white/10 text-xs font-black text-white hover:bg-white/20"
                    onClick={onClose}
                    type="button"
                >
                    X
                </button>
            </div>
        </div>
    );
}
