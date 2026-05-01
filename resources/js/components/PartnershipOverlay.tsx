import { useEffect, useMemo, useState } from 'react';

export default function PartnershipOverlay({ show, data, teamColor, onClose }: any) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            const timeout = window.setTimeout(() => setVisible(false), 500);

            return () => window.clearTimeout(timeout);
        }
    }, [show]);

    const accent = teamColor || '#22d3ee';
    const players = data?.players || [];
    const maxContribution = useMemo(
        () => Math.max(1, ...players.map((player: any) => player.runs || 0)),
        [players],
    );

    if (!visible) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[76] font-sans">
            <div
                className={`absolute top-1/2 left-16 h-[420px] w-[860px] -translate-y-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#07111f] text-white shadow-2xl transition-all duration-700 ${show ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
            >
                <div
                    className="absolute top-0 left-0 h-1.5 w-full"
                    style={{ backgroundColor: accent }}
                />

                <div className="grid h-full grid-cols-[300px_1fr]">
                    <div className="relative flex flex-col justify-between overflow-hidden bg-[#101b2e] p-7">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.16),transparent_34%)]" />
                        <div className="relative">
                            <div
                                className="mb-4 inline-flex rounded-sm px-4 py-1 text-xs font-black tracking-[0.28em] text-black uppercase"
                                style={{ backgroundColor: accent }}
                            >
                                Partnership
                            </div>
                            <div className="text-sm font-bold tracking-widest text-slate-300 uppercase">
                                {data?.teamName || 'Batting Team'}
                            </div>
                            <div className="mt-2 text-2xl font-black uppercase">
                                {data?.score || '0-0'}
                            </div>
                            <div className="mt-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                                {data?.overs || '0.0'} overs
                            </div>
                        </div>

                        <div className="relative">
                            <div className="text-[90px] font-black leading-none tracking-tight">
                                {data?.runs ?? 0}
                            </div>
                            <div className="mt-2 text-sm font-black tracking-[0.28em] text-slate-300 uppercase">
                                runs from {data?.balls ?? 0} balls
                            </div>
                            <div className="mt-4 inline-flex rounded bg-black/30 px-4 py-2 text-xs font-black tracking-widest text-slate-200 uppercase">
                                RR {data?.runRate || '0.00'}
                            </div>
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-col p-7">
                        <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                            <div className="min-w-0">
                                <h2 className="truncate text-4xl font-black tracking-wide uppercase">
                                    Current Stand
                                </h2>
                                <div className="mt-2 text-sm font-bold tracking-widest text-slate-400 uppercase">
                                    {data?.title || 'Match Partnership'}
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

                        <div className="grid flex-1 gap-4">
                            {players.map((player: any) => {
                                const width = `${Math.max(8, ((player.runs || 0) / maxContribution) * 100)}%`;

                                return (
                                    <div
                                        key={player.id || player.name}
                                        className="rounded-lg border border-white/10 bg-white/[0.05] p-4"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="truncate text-xl font-black uppercase">
                                                    {player.name || 'Batter'}
                                                    {player.isStriker ? ' *' : ''}
                                                </div>
                                                <div className="mt-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                                                    Contribution
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-black">
                                                    {player.runs ?? 0}
                                                </div>
                                                <div className="text-xs font-bold text-slate-400">
                                                    {player.balls ?? 0} balls
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/35">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width,
                                                    backgroundColor: accent,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-5 flex items-center gap-2 overflow-hidden border-t border-white/10 pt-4">
                            <span className="mr-2 shrink-0 text-[11px] font-black tracking-widest text-slate-400 uppercase">
                                Recent
                            </span>
                            {(data?.recent || []).map((ball: any, index: number) => (
                                <span
                                    key={`${ball.value}-${index}`}
                                    className="flex h-8 min-w-8 items-center justify-center rounded bg-white/10 px-2 text-xs font-black"
                                >
                                    {ball.value}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
