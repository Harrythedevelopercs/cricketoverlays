import { useEffect, useState } from 'react';

const ballTone = (value: string) => {
    if (value === 'W') {
        return 'bg-rose-500 text-white';
    }

    if (value === '4' || value === '6') {
        return 'bg-amber-300 text-black';
    }

    if (value === '.') {
        return 'bg-slate-700 text-slate-200';
    }

    return 'bg-sky-400 text-black';
};

export default function ThisOverOverlay({ show, data, teamColor, onClose }: any) {
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

    const accent = teamColor || '#38bdf8';
    const balls = data?.balls || [];

    return (
        <div className="pointer-events-none fixed inset-0 z-[76] font-sans">
            <div
                className={`absolute top-1/2 left-16 h-[460px] w-[860px] -translate-y-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#07111f] text-white shadow-2xl transition-all duration-700 ${show ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
            >
                <div
                    className="absolute top-0 left-0 h-1.5 w-full"
                    style={{ backgroundColor: accent }}
                />

                <div className="flex items-start justify-between border-b border-white/10 px-7 py-5">
                    <div className="min-w-0">
                        <div
                            className="mb-3 inline-flex rounded-sm px-4 py-1 text-xs font-black tracking-[0.28em] text-black uppercase"
                            style={{ backgroundColor: accent }}
                        >
                            This Over
                        </div>
                        <h2 className="truncate text-5xl font-black leading-none uppercase">
                            Over {data?.overNumber || 0}
                        </h2>
                        <div className="mt-2 text-sm font-bold tracking-widest text-slate-400 uppercase">
                            {data?.teamName || 'Batting Team'} | {data?.score || '0-0'} | {data?.overs || '0.0'} overs
                        </div>
                    </div>
                    <button
                        className="pointer-events-auto h-8 w-8 rounded bg-white/10 text-sm font-black text-white hover:bg-white/20"
                        onClick={onClose}
                        type="button"
                    >
                        X
                    </button>
                </div>

                <div className="grid grid-cols-[250px_1fr] gap-5 px-7 py-5">
                    <div className="rounded-lg border border-white/10 bg-white/[0.05] p-5">
                        <div className="text-[82px] font-black leading-none">
                            {data?.runs ?? 0}
                        </div>
                        <div className="mt-2 text-xs font-black tracking-[0.26em] text-slate-400 uppercase">
                            runs this over
                        </div>
                        <div className="mt-5 rounded bg-black/25 px-4 py-3">
                            <div className="text-[11px] font-black tracking-widest text-slate-400 uppercase">
                                Bowler
                            </div>
                            <div className="mt-1 truncate text-xl font-black uppercase">
                                {data?.bowler?.name || 'Bowler'}
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-300">
                                {data?.bowler?.wickets ?? 0}-{data?.bowler?.runs ?? 0} | {data?.bowler?.balls ?? 0} balls
                            </div>
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-col justify-between gap-5">
                        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                            <div className="mb-3 text-[11px] font-black tracking-widest text-slate-400 uppercase">
                                Ball by ball
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {balls.length ? (
                                    balls.map((ball: any, index: number) => (
                                        <div
                                            key={`${ball.value}-${index}`}
                                            className={`flex h-14 min-w-14 items-center justify-center rounded-lg px-3 text-2xl font-black shadow-lg ${ballTone(String(ball.value))}`}
                                        >
                                            {ball.value}
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-lg border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-bold text-slate-300">
                                        No balls recorded yet
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {(data?.batters || []).map((batter: any) => (
                                <div
                                    key={batter.name}
                                    className="rounded-lg border border-white/10 bg-white/[0.05] p-4"
                                >
                                    <div className="truncate text-lg font-black uppercase">
                                        {batter.name}
                                    </div>
                                    <div className="mt-1 text-sm font-bold text-slate-400">
                                        {batter.runs ?? 0} from {batter.balls ?? 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
