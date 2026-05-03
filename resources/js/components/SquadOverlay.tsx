import { useEffect, useMemo, useState } from 'react';

const defaultPlayers = [
    {
        name: 'VIRAT KOHLI',
        role: 'BATTER',
        status: 'not out',
        runs: 42,
        balls: 28,
        fours: 4,
        sixes: 1,
    },
    {
        name: 'ROHIT SHARMA',
        role: 'CAPTAIN',
        status: 'c Smith b Johnson',
        runs: 25,
        balls: 19,
        fours: 3,
        sixes: 1,
    },
    {
        name: 'KL RAHUL',
        role: 'WICKET KEEPER',
        status: 'run out',
        runs: 18,
        balls: 14,
        fours: 2,
        sixes: 0,
    },
    {
        name: 'SURYAKUMAR YADAV',
        role: 'BATTER',
        status: 'not out',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
    },
    {
        name: 'HARDIK PANDYA',
        role: 'ALL ROUNDER',
        status: 'yet to bat',
        runs: '',
        balls: '',
        fours: '',
        sixes: '',
    },
    {
        name: 'RAVINDRA JADEJA',
        role: 'ALL ROUNDER',
        status: 'yet to bat',
        runs: '',
        balls: '',
        fours: '',
        sixes: '',
    },
    {
        name: 'AXAR PATEL',
        role: 'ALL ROUNDER',
        status: 'yet to bat',
        runs: '',
        balls: '',
        fours: '',
        sixes: '',
    },
    {
        name: 'R ASHWIN',
        role: 'BOWLER',
        status: 'yet to bat',
        runs: '',
        balls: '',
        fours: '',
        sixes: '',
    },
    {
        name: 'JASPRIT BUMRAH',
        role: 'BOWLER',
        status: 'yet to bat',
        runs: '',
        balls: '',
        fours: '',
        sixes: '',
    },
    {
        name: 'MOHAMMAD SHAMI',
        role: 'BOWLER',
        status: 'yet to bat',
        runs: '',
        balls: '',
        fours: '',
        sixes: '',
    },
    {
        name: 'MOHAMMED SIRAJ',
        role: 'BOWLER',
        status: 'yet to bat',
        runs: '',
        balls: '',
        fours: '',
        sixes: '',
    },
];

const isActiveBatter = (status?: string) => {
    const value = status?.toLowerCase() || '';

    return value.includes('not out');
};

const isDismissed = (status?: string) => {
    const value = status?.toLowerCase() || '';

    return value && !value.includes('not out') && !value.includes('yet to bat');
};

const statValue = (value: unknown) =>
    value === null || value === undefined || value === '' ? '-' : String(value);

export default function SquadOverlay({
    show,
    teamName,
    logo,
    score,
    overs,
    extras,
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
    const displayTeamName = teamName || 'Team Scorecard';
    const displayLogo =
        logo || 'https://placehold.co/240x240/101820/white?text=TEAM';
    const scoreParts = String(score || '').split('-');
    const providedRuns = Number(scoreParts[0]);
    const providedWickets = Number(scoreParts[1]);
    const totalRuns = displayPlayers.reduce(
        (sum: number, player: any) => sum + (Number(player.runs) || 0),
        0,
    );
    const wickets = displayPlayers.filter((player: any) =>
        isDismissed(player.status),
    ).length;
    const totalBalls = displayPlayers.reduce(
        (sum: number, player: any) => sum + (Number(player.balls) || 0),
        0,
    );
    const displayRuns = Number.isFinite(providedRuns)
        ? providedRuns
        : totalRuns;
    const displayWickets = Number.isFinite(providedWickets)
        ? providedWickets
        : wickets;
    const displayOvers =
        overs || `${Math.floor(totalBalls / 6)}.${totalBalls % 6}`;

    if (!visible) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[75] overflow-hidden font-sans text-white">
            <div
                className={`absolute top-1/2 left-1/2 w-[1320px] -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${show ? 'scale-100 opacity-100' : 'translate-y-[-46%] scale-96 opacity-0'}`}
            >
                <div className="overflow-hidden rounded-xl border border-white/20 bg-[#101820]/92 shadow-[0_20px_80px_rgba(0,0,0,0.65)] backdrop-blur-[2px]">
                    <div className="grid grid-cols-[150px_1fr_260px] items-center border-b border-white/15 bg-[#141b28]/95">
                        <div className="flex h-[120px] items-center justify-center border-r border-white/10 bg-black/20">
                            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white p-2 shadow-inner">
                                <img
                                    src={displayLogo}
                                    alt={displayTeamName}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>

                        <div className="min-w-0 px-8">
                            <div className="mb-2 inline-flex rounded bg-[#f5c542] px-4 py-1 text-xs font-black tracking-[0.28em] text-black uppercase">
                                Batting Card
                            </div>
                            <h1 className="truncate text-[48px] leading-none font-black tracking-tight uppercase">
                                {displayTeamName}
                            </h1>
                        </div>

                        <div className="grid h-full grid-cols-2 border-l border-white/10 bg-black/20">
                            <div className="flex flex-col justify-center px-5">
                                <span className="text-xs font-black tracking-[0.25em] text-slate-400 uppercase">
                                    Total
                                </span>
                                <span className="mt-1 text-5xl font-black">
                                    {displayRuns}-{displayWickets}
                                </span>
                            </div>
                            <div className="flex flex-col justify-center border-l border-white/10 px-5">
                                <span className="text-xs font-black tracking-[0.25em] text-slate-400 uppercase">
                                    Overs
                                </span>
                                <span className="mt-1 text-5xl font-black">
                                    {displayOvers}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-[360px_1fr_90px_90px_80px_80px] border-b border-white/10 bg-[#0b111b]/95 px-7 py-3 text-xs font-black tracking-[0.24em] text-slate-400 uppercase">
                        <div>Batter</div>
                        <div>How out / details</div>
                        <div className="text-center">Runs</div>
                        <div className="text-center">Balls</div>
                        <div className="text-center">4s</div>
                        <div className="text-center">6s</div>
                    </div>

                    <div className="grid h-[560px] grid-rows-11">
                        {displayPlayers.map((player: any, index: number) => {
                            const active = isActiveBatter(player.status);
                            const dismissed = isDismissed(player.status);

                            return (
                                <div
                                    key={player.id || `${player.name}-${index}`}
                                    className={`grid grid-cols-[360px_1fr_90px_90px_80px_80px] items-center border-b border-white/[0.07] px-7 ${active ? 'bg-[#f5c542]/16' : dismissed ? 'bg-white/[0.045]' : index % 2 === 0 ? 'bg-black/[0.12]' : 'bg-white/[0.025]'}`}
                                    style={{
                                        animation: `scorecardRowIn 0.42s ease-out forwards ${index * 0.04}s`,
                                        opacity: 0,
                                    }}
                                >
                                    <div className="min-w-0 pr-6">
                                        <div className="truncate text-[26px] leading-none font-black tracking-wide uppercase">
                                            {player.name ||
                                                `Player ${index + 1}`}
                                        </div>
                                        <div className="mt-1 truncate text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                            {player.role || 'Player'}
                                        </div>
                                    </div>

                                    <div className="min-w-0 truncate pr-6 text-[21px] font-bold tracking-wide text-slate-200 uppercase">
                                        {player.status || 'yet to bat'}
                                    </div>

                                    <div className="text-center text-[30px] font-black">
                                        {statValue(player.runs)}
                                    </div>
                                    <div className="text-center text-[30px] font-black text-slate-200">
                                        {statValue(player.balls)}
                                    </div>
                                    <div className="text-center text-[24px] font-black text-slate-300">
                                        {statValue(player.fours)}
                                    </div>
                                    <div className="text-center text-[24px] font-black text-slate-300">
                                        {statValue(player.sixes)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid h-16 grid-cols-[220px_1fr_240px_260px] items-center border-t border-white/15 bg-[#e8ebef] text-black">
                        <div className="px-8 text-2xl font-black uppercase">
                            Extras {statValue(extras)}
                        </div>
                        <div className="flex h-full items-center justify-center border-l border-black/15 text-2xl font-black uppercase">
                            Balls {totalBalls}
                        </div>
                        <div className="flex h-full items-center justify-center border-l border-black/15 text-2xl font-black uppercase">
                            Overs {displayOvers}
                        </div>
                        <div className="flex h-full items-center justify-center border-l border-black/15 text-4xl font-black">
                            {displayRuns}-{displayWickets}
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
                @keyframes scorecardRowIn {
                    from { opacity: 0; transform: translateX(24px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}
