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
        return 'PLAYING XI';
    }

    return role.replace(/\//g, ' / ').toUpperCase();
};

const isFeaturedPlayer = (role?: string) => {
    const normalizedRole = role?.toLowerCase() || '';

    return (
        normalizedRole.includes('captain') ||
        normalizedRole.includes('wicket keeper')
    );
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

        const timeout = window.setTimeout(() => setVisible(false), 500);

        return () => window.clearTimeout(timeout);
    }, [show]);

    const displayPlayers = useMemo(
        () => (players?.length ? players : defaultPlayers).slice(0, 11),
        [players],
    );
    const displayTeamName = teamName || 'TEAM SQUAD';
    const displayLogo =
        logo || 'https://placehold.co/240x240/12351e/white?text=TEAM';

    if (!visible) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[75] overflow-hidden bg-[#06101c] font-sans text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(89,143,255,0.28),transparent_28%),linear-gradient(180deg,rgba(33,64,128,0.9)_0%,rgba(5,12,22,0.92)_62%,rgba(0,0,0,0.98)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(0deg,rgba(0,0,0,0.9),rgba(0,0,0,0)),repeating-linear-gradient(90deg,rgba(255,255,255,0.10)_0_1px,transparent_1px_70px)] opacity-70" />
            <div
                className={`absolute top-1/2 left-1/2 h-[720px] w-[1320px] -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                <div className="absolute top-0 left-0 z-20 flex h-44 w-44 items-center justify-center rounded-full border-[8px] border-[#dbe7e8] bg-[#12351e] shadow-[0_0_0_8px_rgba(80,140,220,0.35),0_14px_34px_rgba(0,0,0,0.55)]">
                    <img
                        src={displayLogo}
                        alt={displayTeamName}
                        className="h-32 w-32 rounded-full object-contain"
                    />
                </div>

                <div className="absolute top-[74px] right-0 left-[138px] h-[92px] rounded-tr-[34px] border-[6px] border-[#cfd8df] bg-gradient-to-b from-[#1a552d] via-[#11391f] to-[#071109] shadow-[inset_0_3px_0_rgba(255,255,255,0.24),0_12px_30px_rgba(0,0,0,0.5)]">
                    <div className="flex h-full items-center px-12">
                        <h1 className="truncate text-[56px] leading-none font-black tracking-wide text-white uppercase drop-shadow-[0_3px_2px_rgba(0,0,0,0.7)]">
                            {displayTeamName}
                        </h1>
                    </div>
                </div>

                <div className="absolute top-[160px] right-4 left-[70px] h-[520px] overflow-hidden rounded-br-[22px] rounded-bl-[22px] border-[5px] border-[#b8c4c9] bg-[#0c321b]/95 shadow-[0_18px_50px_rgba(0,0,0,0.6)]">
                    <div className="grid h-14 grid-cols-[430px_1fr_150px_130px] border-b-4 border-[#aeb7bc] bg-gradient-to-r from-[#2e7b3f] via-[#28663a] to-[#14361f] text-[24px] font-black tracking-wider text-white uppercase">
                        <div className="pl-[150px]" />
                        <div className="flex items-center">
                            Club Cricket of Chicago
                        </div>
                        <div className="flex items-center justify-center">
                            No.
                        </div>
                        <div className="flex items-center justify-center">
                            Role
                        </div>
                    </div>

                    <div className="grid h-[410px] grid-cols-[430px_1fr_150px_130px] bg-[linear-gradient(90deg,rgba(12,44,23,0.98)_0_29%,rgba(32,93,45,0.95)_29%_77%,rgba(9,38,20,0.98)_77%)]">
                        <div className="col-span-4 grid grid-rows-11">
                            {displayPlayers.map(
                                (player: any, index: number) => {
                                    const featured = isFeaturedPlayer(
                                        player.role,
                                    );

                                    return (
                                        <div
                                            key={
                                                player.id ||
                                                `${player.name}-${index}`
                                            }
                                            className={`grid grid-cols-[430px_1fr_150px_130px] border-b border-white/5 ${featured ? 'bg-gradient-to-r from-[#9d0000] via-[#c40000] to-[#8d0000]' : index % 2 === 0 ? 'bg-white/[0.035]' : 'bg-black/[0.08]'}`}
                                            style={{
                                                animation: `squadRowIn 0.45s ease-out forwards ${index * 0.045}s`,
                                                opacity: 0,
                                            }}
                                        >
                                            <div className="flex items-center truncate pl-7 text-[30px] leading-none font-black tracking-wide uppercase drop-shadow-[0_2px_1px_rgba(0,0,0,0.55)]">
                                                {player.name ||
                                                    `Player ${index + 1}`}
                                            </div>
                                            <div className="flex items-center truncate px-7 text-[24px] font-semibold tracking-wide text-white/80 uppercase">
                                                {roleLabel(player.role)}
                                            </div>
                                            <div className="flex items-center justify-center text-[30px] font-black">
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </div>
                                            <div className="flex items-center justify-center text-[19px] font-black tracking-widest text-white/75 uppercase">
                                                XI
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    <div className="grid h-[86px] grid-cols-[260px_1fr_300px_270px] border-t-4 border-[#aeb7bc] bg-gradient-to-b from-[#f2f4f2] to-[#bfc6c5] text-black">
                        <div className="flex items-center px-10 text-[30px] font-black uppercase">
                            Squad
                        </div>
                        <div className="flex items-center justify-center text-[30px] font-black uppercase">
                            Playing XI
                        </div>
                        <div className="flex items-center justify-center border-l border-black/15 text-[30px] font-black uppercase">
                            Players
                        </div>
                        <div className="flex items-center justify-center border-l border-black/15 text-[48px] font-black">
                            {displayPlayers.length}
                        </div>
                    </div>
                </div>

                <button
                    className="pointer-events-auto absolute top-[174px] right-8 z-30 h-9 w-9 rounded bg-black/35 text-sm font-black text-white hover:bg-black/55"
                    onClick={onClose}
                    type="button"
                >
                    X
                </button>
            </div>

            <style>{`
                @keyframes squadRowIn {
                    from { opacity: 0; transform: translateX(28px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}
