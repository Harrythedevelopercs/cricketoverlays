import { useEffect, useState } from 'react';

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
        } else {
            setTimeout(() => setVisible(false), 500);
        }
    }, [show]);

    if (!visible) {
return null;
}

    // Default mock data if no props are passed
    const defaultPlayers = [
        { name: 'VIRAT KOHLI', role: 'BATSMAN' },
        { name: 'ROHIT SHARMA', role: 'CAPTAIN' },
        { name: 'KL RAHUL', role: 'WICKETKEEPER' },
        { name: 'SURYAKUMAR YADAV', role: 'BATSMAN' },
        { name: 'HARDIK PANDYA', role: 'ALL-ROUNDER' },
        { name: 'RAVINDRA JADEJA', role: 'ALL-ROUNDER' },
        { name: 'AXAR PATEL', role: 'ALL-ROUNDER' },
        { name: 'R ASHWIN', role: 'BOWLER' },
        { name: 'JASPRIT BUMRAH', role: 'BOWLER' },
        { name: 'MOHAMMAD SHAMI', role: 'BOWLER' },
        { name: 'MOHAMMED SIRAJ', role: 'BOWLER' },
    ];

    const displayPlayers = players || defaultPlayers;
    const displayTeamName = teamName || 'INDIA';
    const displayLogo =
        logo || 'https://placehold.co/200x200/111/white?text=LOGO';

    return (
        <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center font-sans">
            {/* Dark gradient background */}
            <div
                className={`pointer-events-auto absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            {/* Main Panel */}
            <div
                className={`relative flex h-[650px] w-[1000px] transform transition-all duration-700 ${show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-10 scale-95 opacity-0'}`}
            >
                {/* Left Side: Team Logo & Name */}
                <div className="relative flex w-[35%] flex-col items-center justify-center overflow-hidden rounded-l-xl border-y-4 border-l-4 border-[#ffb703] bg-gradient-to-b from-[#0a192f] to-[#020c1b] p-8 text-white shadow-[0_0_50px_rgba(0,0,0,0.9)]">
                    {/* Abstract background design */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBsNDAgNDBNMCA0MGw0MC00MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-20"></div>

                    <img
                        src={displayLogo}
                        className="relative z-10 mb-8 h-48 w-48 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                        alt="Team Logo"
                    />

                    <h2 className="relative z-10 mb-2 text-center text-4xl font-black tracking-widest uppercase drop-shadow-lg">
                        {displayTeamName}
                    </h2>

                    <div className="relative z-10 mt-4 rounded-sm bg-[#ffb703] px-6 py-2 text-sm font-black tracking-[0.4em] text-black uppercase shadow-lg">
                        Playing XI
                    </div>
                </div>

                {/* Right Side: Player List */}
                <div className="relative flex w-[65%] flex-col overflow-hidden rounded-r-xl border-y-4 border-r-4 border-[#ffb703] bg-[#0f172a] shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
                    {/* Header */}
                    <div className="relative z-20 flex items-center justify-between border-b border-[#334155] bg-[#1e293b] px-8 py-4 shadow-md">
                        <h3 className="text-2xl font-black tracking-widest text-white uppercase">
                            Squad Details
                        </h3>
                        <div className="flex space-x-2">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>
                    </div>

                    {/* Background Graphic */}
                    <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 opacity-5">
                        <svg
                            viewBox="0 0 100 100"
                            fill="currentColor"
                            className="h-full w-full text-white"
                        >
                            <path d="M50 0L100 50L50 100L0 50Z" />
                        </svg>
                    </div>

                    {/* Players Grid */}
                    <div className="relative z-10 grid flex-1 grid-cols-2 content-start gap-x-8 gap-y-4 overflow-hidden p-8">
                        {displayPlayers.map((player: any, idx: number) => (
                            <div
                                key={idx}
                                className="flex items-center space-x-4 rounded-r border-l-[6px] border-[#38bdf8] bg-gradient-to-r from-[#1e293b] to-transparent p-3 transition-colors duration-300 hover:border-[#ffb703]"
                                style={{
                                    animation: `fadeInRight 0.5s ease-out forwards ${idx * 0.05}s`,
                                    opacity: 0,
                                }}
                            >
                                <style>{`
                                    @keyframes fadeInRight {
                                        from { opacity: 0; transform: translateX(20px); }
                                        to { opacity: 1; transform: translateX(0); }
                                    }
                                `}</style>
                                <div className="flex h-10 w-10 items-center justify-center rounded border border-[#334155] bg-[#0f172a] text-lg font-black text-[#38bdf8] shadow-inner">
                                    {idx + 1}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-[17px] leading-tight font-bold tracking-wider text-white uppercase">
                                        {player.name}
                                    </span>
                                    {player.role && (
                                        <span className="mt-1 text-[11px] font-black tracking-widest text-[#94a3b8] uppercase">
                                            {player.role}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
