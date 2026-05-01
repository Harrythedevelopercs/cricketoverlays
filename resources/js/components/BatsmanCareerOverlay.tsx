import { useEffect, useState } from 'react';

const cricclubsImageUrl = (path?: string) => {
    if (!path) {
        return 'https://placehold.co/360x460/101827/white?text=PLAYER';
    }

    if (path.startsWith('http')) {
        return path;
    }

    return `https://media.cricclubs.com${path.startsWith('/') ? path : `/${path}`}`;
};

export default function BatsmanCareerOverlay({
    show,
    data,
    title = 'Career',
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

    const batting = data?.batting || {};
    const bowling = data?.bowling || null;
    const accent = teamColor || '#ffb703';
    const stats = bowling
        ? [
              ['MATCHES', bowling.matches ?? 0],
              ['INNINGS', bowling.innings ?? 0],
              ['OVERS', bowling.overs ?? '0.0'],
              ['RUNS', bowling.runs ?? 0],
              ['WICKETS', bowling.wickets ?? 0],
              ['BEST', bowling.best ?? '0/0'],
              ['AVG', bowling.average ?? '0.00'],
              ['ECON', bowling.economy ?? '0.00'],
              ['SR', bowling.strikeRate ?? '0.00'],
              ['MAIDENS', bowling.maidens ?? 0],
          ]
        : [
              ['MATCHES', batting.matches ?? 0],
              ['INNINGS', batting.innings ?? 0],
              ['RUNS', batting.runs ?? 0],
              ['HIGH', batting.highestScore ?? 0],
              ['AVG', batting.average ?? '0.00'],
              ['SR', batting.strikeRate ?? '0.00'],
              ['4S', batting.fours ?? 0],
              ['6S', batting.sixes ?? 0],
              ['50S', batting.fifties ?? 0],
              ['100S', batting.hundreds ?? 0],
          ];

    return (
        <div className="pointer-events-none fixed inset-0 z-[76] font-sans">
            <div
                className={`absolute top-1/2 left-16 flex h-[430px] w-[880px] -translate-y-1/2 transform overflow-hidden rounded-xl border border-white/10 bg-[#07111f] text-white shadow-2xl transition-all duration-700 ${show ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
            >
                <div
                    className="absolute top-0 left-0 h-1.5 w-full"
                    style={{ backgroundColor: accent }}
                />

                <div className="relative flex w-[32%] items-end justify-center overflow-hidden bg-[#0d1728]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.14),transparent_36%)]" />
                    <img
                        src={cricclubsImageUrl(data?.image)}
                        alt={data?.name || 'Player'}
                        className="relative z-10 h-[112%] w-full object-cover object-top"
                    />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="border-b border-white/10 px-8 py-6">
                        <div
                            className="mb-3 inline-flex rounded-sm px-4 py-1 text-xs font-black tracking-[0.32em] text-black uppercase"
                            style={{ backgroundColor: accent }}
                        >
                            {title}
                        </div>
                        <h2 className="truncate text-5xl font-black tracking-wide uppercase">
                            {data?.name || 'Player'}
                        </h2>
                        <div className="mt-2 flex gap-3 text-sm font-bold tracking-widest text-slate-300 uppercase">
                            <span>{data?.role || 'Player'}</span>
                            {data?.teamName && <span>{data.teamName}</span>}
                        </div>
                    </div>

                    <div className="grid flex-1 grid-cols-5 gap-px bg-white/10 p-px">
                        {stats.map(([label, value]) => (
                            <div
                                key={label}
                                className="flex flex-col items-center justify-center bg-[#101b2e] px-3"
                            >
                                <span className="mb-2 text-[11px] font-black tracking-[0.22em] text-slate-400">
                                    {label}
                                </span>
                                <span className="text-3xl font-black">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="pointer-events-auto absolute top-4 right-4 h-8 w-8 rounded bg-white/10 text-sm font-black text-white hover:bg-white/20"
                    onClick={onClose}
                    type="button"
                >
                    X
                </button>
            </div>
        </div>
    );
}
