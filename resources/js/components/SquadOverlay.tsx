import { useEffect, useMemo, useState } from 'react';

const defaultPlayers = [
    { name: 'VIRAT KOHLI', role: 'BATTER' },
    { name: 'ROHIT SHARMA', role: 'CAPTAIN' },
    { name: 'KL RAHUL', role: 'WICKET KEEPER' },
    { name: 'SURYAKUMAR YADAV', role: 'BATTER' },
    { name: 'HARDIK PANDYA', role: 'ALL ROUNDER' },
    { name: 'RAVINDRA JADEJA', role: 'ALL ROUNDER' },
    { name: 'AXAR PATEL', role: 'ALL ROUNDER' },
    { name: 'R ASHWIN', role: 'BOWLER' },
    { name: 'JASPRIT BUMRAH', role: 'BOWLER' },
    { name: 'MOHAMMAD SHAMI', role: 'BOWLER' },
    { name: 'MOHAMMED SIRAJ', role: 'BOWLER' },
];

const roleLabel = (role?: string) => {
    if (!role || role === 'Player') {
        return 'Playing XI';
    }

    return role.replace(/\//g, ' / ');
};

const playerTags = (role?: string) => {
    const normalizedRole = role?.toLowerCase() || '';
    const tags = [];

    if (normalizedRole.includes('captain')) {
        tags.push('C');
    }

    if (normalizedRole.includes('wicket keeper')) {
        tags.push('WK');
    }

    if (normalizedRole.includes('left')) {
        tags.push('LH');
    }

    if (normalizedRole.includes('right')) {
        tags.push('RH');
    }

    return tags.length ? tags : ['XI'];
};

export default function SquadOverlay({
    show,
    teamName,
    logo,
    players,
    onClose,
}: any) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
            return;
        }

        const timeout = window.setTimeout(() => setVisible(false), 450);

        return () => window.clearTimeout(timeout);
    }, [show]);

    const displayPlayers = useMemo(
        () => (players?.length ? players : defaultPlayers).slice(0, 11),
        [players],
    );
    const displayTeamName = teamName || 'Team Squad';
    const displayLogo =
        logo || 'https://placehold.co/240x240/101820/white?text=TEAM';

    if (!visible) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[75] overflow-hidden bg-[#070a10] font-sans text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(56,189,248,0.24),transparent_28%),radial-gradient(circle_at_80%_78%,rgba(245,197,66,0.18),transparent_30%),linear-gradient(135deg,#070a10_0%,#111827_54%,#05070b_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[linear-gradient(0deg,rgba(0,0,0,0.86),transparent),repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0_1px,transparent_1px_64px)]" />

            <div
                className={`absolute top-1/2 left-1/2 w-[1280px] -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${show ? 'translate-y-[-50%] scale-100 opacity-100' : 'translate-y-[-46%] scale-95 opacity-0'}`}
            >
                <div className="overflow-hidden rounded-xl border border-white/15 bg-[#101820]/95 shadow-[0_22px_70px_rgba(0,0,0,0.62)]">
                    <div className="grid grid-cols-[190px_1fr_230px] items-center border-b border-white/12 bg-[#141b28]">
                        <div className="flex h-[150px] items-center justify-center border-r border-white/10 bg-black/20">
                            <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-white/15 bg-white p-3 shadow-inner">
                                <img
                                    src={displayLogo}
                                    alt={displayTeamName}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>

                        <div className="min-w-0 px-8">
                            <div className="mb-3 inline-flex rounded bg-[#f5c542] px-4 py-1 text-xs font-black tracking-[0.28em] text-black uppercase">
                                Squad List
                            </div>
                            <h1 className="truncate text-[54px] leading-none font-black tracking-tight text-white uppercase">
                                {displayTeamName}
                            </h1>
                            <div className="mt-3 text-sm font-bold tracking-[0.28em] text-slate-400 uppercase">
                                Club Cricket of Chicago overlays
                            </div>
                        </div>

                        <div className="h-full border-l border-white/10 bg-black/20 px-7 py-5">
                            <div className="text-xs font-black tracking-[0.25em] text-slate-400 uppercase">
                                Players
                            </div>
                            <div className="mt-2 text-6xl font-black text-white">
                                {displayPlayers.length}
                            </div>
                            <div className="mt-2 h-1.5 w-full rounded-full bg-[#f5c542]" />
                        </div>
                    </div>

                    <div className="grid grid-cols-[90px_1.25fr_1fr_220px] border-b border-white/10 bg-[#0c111b] px-7 py-3 text-xs font-black tracking-[0.26em] text-slate-400 uppercase">
                        <div>No.</div>
                        <div>Player</div>
                        <div>Details</div>
                        <div className="text-right">Tags</div>
                    </div>

                    <div className="grid h-[520px] grid-rows-11">
                        {displayPlayers.map((player: any, index: number) => {
                            const tags = playerTags(player.role);
                            const isKeyPlayer =
                                tags.includes('C') || tags.includes('WK');

                            return (
                                <div
                                    key={player.id || `${player.name}-${index}`}
                                    className={`grid grid-cols-[90px_1.25fr_1fr_220px] items-center border-b border-white/[0.07] px-7 transition-colors ${isKeyPlayer ? 'bg-[#f5c542]/12' : index % 2 === 0 ? 'bg-white/[0.045]' : 'bg-black/[0.12]'}`}
                                    style={{
                                        animation: `squadRowIn 0.42s ease-out forwards ${index * 0.045}s`,
                                        opacity: 0,
                                    }}
                                >
                                    <div className="flex h-10 w-12 items-center justify-center rounded border border-white/10 bg-black/25 text-lg font-black text-[#f5c542]">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    <div className="min-w-0 pr-6">
                                        <div className="truncate text-[28px] leading-none font-black tracking-wide text-white uppercase">
                                            {player.name ||
                                                `Player ${index + 1}`}
                                        </div>
                                    </div>

                                    <div className="min-w-0 truncate text-[19px] font-bold tracking-wide text-slate-300 uppercase">
                                        {roleLabel(player.role)}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        {tags.map((tag) => (
                                            <span
                                                key={`${player.id || player.name}-${tag}`}
                                                className={`min-w-11 rounded px-3 py-1 text-center text-xs font-black tracking-widest uppercase ${tag === 'C' || tag === 'WK' ? 'bg-[#f5c542] text-black' : 'bg-white/10 text-slate-200'}`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid h-16 grid-cols-[1fr_240px_260px] items-center border-t border-white/12 bg-[#e7ebef] text-black">
                        <div className="px-8 text-xl font-black tracking-wide uppercase">
                            Team sheet confirmed
                        </div>
                        <div className="flex h-full items-center justify-center border-l border-black/15 text-xl font-black uppercase">
                            Playing XI
                        </div>
                        <div className="flex h-full items-center justify-center border-l border-black/15 text-3xl font-black">
                            {displayPlayers.length}/11
                        </div>
                    </div>
                </div>

                <button
                    className="pointer-events-auto absolute top-4 right-4 h-9 w-9 rounded bg-black/45 text-sm font-black text-white hover:bg-black/70"
                    onClick={onClose}
                    type="button"
                >
                    X
                </button>
            </div>

            <style>{`
                @keyframes squadRowIn {
                    from { opacity: 0; transform: translateX(24px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}
