export default function Scorebar({ data }: { data: any }) {
    const teamOneLogo =
        data?.battingLogo ||
        (data?.team_one_logo
            ? `/storage/${data.team_one_logo}`
            : 'https://placehold.co/100x100/orange/white?text=T1');
    const teamTwoLogo =
        data?.bowlingLogo ||
        (data?.team_two_logo
            ? `/storage/${data.team_two_logo}`
            : 'https://placehold.co/100x100/111/white?text=T2');
    const battingTeam = data?.battingTeam || data?.team_one_title || 'Team One';
    const bowlingTeam = data?.bowlingTeam || data?.team_two_title || 'Team Two';
    const score = data?.score || '0-0';
    const overs = data?.overs || '0.0';
    const ticker = data?.ticker || data?.title || 'Live Match';
    const runRate = data?.runRate ?? '--';
    const requiredRunRate = data?.requiredRunRate ?? null;
    const batters = data?.batters?.length
        ? data.batters
        : [
              { name: 'Batter 1', runs: 0, balls: 0, isStriker: true },
              { name: 'Batter 2', runs: 0, balls: 0, isStriker: false },
          ];
    const bowler = data?.bowler || {
        name: 'Bowler',
        figures: '0-0',
        overs: '0.0',
    };
    const balls = data?.balls?.length ? data.balls : [];

    const ballClassName = (value: string) => {
        if (value === 'W') {
            return 'bg-[#e31837] text-[12px] font-black';
        }

        if (value === '4' || value === '6') {
            return 'bg-[#0b5ed7] text-[12px] font-black';
        }

        return 'bg-[#2a2a2a] text-[10px]';
    };

    return (
        <div className="fixed bottom-5 left-0 z-50 flex w-full justify-center pb-2 font-sans italic">
            {/* Main Scorebar Container */}
            <div className="relative flex h-[72px] w-[1280px] rounded-sm border-b-4 border-yellow-500 bg-black text-white shadow-2xl">
                {/* Left Floating Logo */}
                <div className="absolute top-1/2 -left-10 z-20 -translate-y-1/2">
                    <div className="flex h-[96px] w-[96px] items-center justify-center overflow-hidden rounded-full border-[5px] border-[#1a1a1a] bg-white shadow-lg">
                        <img
                            src={teamOneLogo}
                            alt="Batting team"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>

                {/* Scorebar Content Container */}
                <div className="relative ml-[50px] flex h-full w-full overflow-hidden bg-[#111]">
                    {/* Background decorations (abstract shapes) */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
                        <div className="absolute top-2 left-10 h-4 w-4 rotate-45 border border-pink-500"></div>
                        <div className="absolute bottom-2 left-20 h-3 w-3 rounded-full border border-green-500"></div>
                        <div className="absolute top-4 left-32 h-5 w-5 rotate-12 border border-purple-500"></div>
                        <div className="absolute right-1/2 bottom-1 h-4 w-4 rotate-45 border border-red-500"></div>
                        <div className="absolute top-3 right-1/4 h-3 w-3 rounded-full border border-yellow-500"></div>
                    </div>

                    {/* SECTION 1: Teams & Ticker (approx 40%) */}
                    <div className="relative z-10 flex h-full w-[40%] flex-col">
                        {/* Top Row */}
                        <div className="relative flex h-[55%] w-full">
                            {/* White part */}
                            <div
                                className="flex w-[88%] items-center justify-between gap-3 bg-white pr-6 pl-10 text-black"
                                style={{
                                    clipPath:
                                        'polygon(0 0, 100% 0, 96% 100%, 0 100%)',
                                }}
                            >
                                <div className="mt-1 flex min-w-0 flex-1 items-center gap-2 text-[17px] leading-none font-black tracking-tight">
                                    <span className="max-w-[105px] shrink truncate text-[11px] text-gray-500 uppercase">
                                        {bowlingTeam} v
                                    </span>
                                    <span className="min-w-0 flex-1 truncate tracking-wide uppercase">
                                        {battingTeam}
                                    </span>
                                </div>
                                <div className="mt-1 shrink-0 text-[22px] font-black tracking-wider">
                                    {score}
                                </div>
                            </div>
                            {/* Dark Grey Part (Overs) */}
                            <div
                                className="-ml-[4%] flex w-[16%] items-center justify-center bg-[#555] text-white"
                                style={{
                                    clipPath:
                                        'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)',
                                }}
                            >
                                <span className="mt-1 text-xl font-black">
                                    {overs}
                                </span>
                            </div>
                        </div>
                        {/* Bottom Row - Ticker */}
                        <div className="flex h-[45%] min-w-0 items-center gap-3 overflow-hidden bg-transparent pr-5 pl-10 text-white">
                            <span className="block min-w-0 truncate text-[13px] leading-none font-black tracking-[0.12em] whitespace-nowrap uppercase">
                                {ticker}
                            </span>
                            <div className="mt-1 flex shrink-0 items-center gap-2 text-[11px] leading-none font-black tracking-widest uppercase">
                                <span className="rounded-sm bg-white/10 px-2 py-1">
                                    RR {runRate}
                                </span>
                                {requiredRunRate !== null && (
                                    <span className="rounded-sm bg-yellow-500 px-2 py-1 text-black">
                                        RRR {requiredRunRate}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Batsmen (approx 25%) */}
                    <div className="relative z-10 flex h-full w-[28%] flex-col justify-center bg-[#c6eef8] font-black text-black">
                        {/* Striker */}
                        <div className="flex h-1/2 min-w-0 items-center justify-between gap-3 border-b border-white/50 px-5">
                            <span className="mt-1 min-w-0 flex-1 truncate text-[15px] uppercase">
                                {batters[0]?.name}
                                {batters[0]?.isStriker ? '*' : ''}
                            </span>
                            <div className="mt-1 flex shrink-0 items-baseline gap-2">
                                <span className="text-[19px]">
                                    {batters[0]?.runs ?? 0}
                                </span>
                                <span className="text-[14px] text-gray-700">
                                    {batters[0]?.balls ?? 0}
                                </span>
                            </div>
                        </div>
                        {/* Non-Striker */}
                        <div className="flex h-1/2 min-w-0 items-center justify-between gap-3 px-5">
                            <span className="mt-1 min-w-0 flex-1 truncate text-[15px] uppercase">
                                {batters[1]?.name || 'Batter'}
                                {batters[1]?.isStriker ? '*' : ''}
                            </span>
                            <div className="mt-1 flex shrink-0 items-baseline gap-2">
                                <span className="text-[19px]">
                                    {batters[1]?.runs ?? 0}
                                </span>
                                <span className="text-[14px] text-gray-700">
                                    {batters[1]?.balls ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Bowler & Balls (approx 35%) */}
                    <div
                        className="relative z-10 h-full w-[32%] bg-[#fedb3b]"
                        style={{
                            clipPath:
                                'polygon(15px 0, 100% 0, 100% 100%, 0 100%)',
                            marginLeft: '-10px',
                        }}
                    >
                        <div className="flex h-full w-[72%] flex-col pl-7">
                            {/* Bowler Stats */}
                            <div className="flex h-1/2 min-w-0 items-center justify-between gap-3 pr-4 font-black text-black">
                                <span className="mt-1 min-w-0 flex-1 truncate text-[16px] uppercase">
                                    {bowler.name}
                                </span>
                                <div className="mt-1 flex shrink-0 items-baseline gap-2">
                                    <span className="text-[19px]">
                                        {bowler.figures}
                                    </span>
                                    <span className="text-[14px] text-gray-700">
                                        {bowler.overs}
                                    </span>
                                </div>
                            </div>
                            {/* Over Balls */}
                            <div className="flex h-1/2 items-center gap-[3px] pb-2">
                                {balls.map((ball: any, index: number) => (
                                    <div
                                        key={index}
                                        className={`flex h-[22px] w-[22px] items-center justify-center rounded-[3px] text-white ${ballClassName(ball.value)}`}
                                    >
                                        {ball.value}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Far Right Team Logo Box */}
                        <div
                            className="absolute top-0 right-0 flex h-full w-[28%] flex-col items-center justify-center bg-[#151515]"
                            style={{
                                clipPath:
                                    'polygon(25px 0, 100% 0, 100% 100%, 0 100%)',
                            }}
                        >
                            <img
                                src={teamTwoLogo}
                                alt="Bowling team"
                                className="mt-1 h-10 w-10 rounded-full object-contain"
                            />
                        </div>

                        {/* Right side decorative background shapes overlapping yellow and black sections */}
                        <div className="pointer-events-none absolute top-0 right-10 bottom-0 w-[150px] opacity-20">
                            <div className="absolute top-2 left-2 h-6 w-6 rotate-45 border-2 border-orange-500"></div>
                            <div className="absolute right-6 bottom-2 h-4 w-4 rounded-sm border-2 border-pink-500"></div>
                            <div className="absolute top-6 right-2 h-5 w-5 rotate-12 border-2 border-purple-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
