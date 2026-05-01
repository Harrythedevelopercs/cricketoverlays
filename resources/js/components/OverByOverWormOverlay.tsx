import { useEffect, useMemo, useState } from 'react';

const COLORS = ['#38bdf8', '#facc15', '#fb7185', '#34d399'];

const tickIntervalForOvers = (overs: number) => {
    if (overs <= 10) {
        return 1;
    }

    if (overs <= 20) {
        return 2;
    }

    return 5;
};

export default function OverByOverWormOverlay({ show, data, onClose }: any) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            const timeout = window.setTimeout(() => setVisible(false), 500);

            return () => window.clearTimeout(timeout);
        }
    }, [show]);

    const chart = useMemo(() => {
        const innings = data?.innings || [];
        const overRows = innings.map((inning: any, index: number) => {
            const points = inning.points || [];
            const overBreakdown = points.slice(1).map((point: any, pointIndex: number) => {
                const previous = points[pointIndex] || { runs: 0, wickets: 0 };

                return {
                    over: point.over,
                    runs: Math.max(0, (point.runs || 0) - (previous.runs || 0)),
                    wickets: Math.max(0, (point.wickets || 0) - (previous.wickets || 0)),
                    totalRuns: point.runs || 0,
                    totalWickets: point.wickets || 0,
                };
            });

            return {
                ...inning,
                color: COLORS[index % COLORS.length],
                overBreakdown,
            };
        });
        const allOvers = overRows.flatMap((inning: any) => inning.overBreakdown || []);
        const maxOverRuns = Math.max(6, ...allOvers.map((over: any) => over.runs || 0));
        const maxOvers = Math.max(1, ...allOvers.map((over: any) => over.over || 0));
        const width = 760;
        const height = 330;
        const padding = 52;
        const topPadding = 34;
        const bottomPadding = 64;
        const innerWidth = width - padding * 2;
        const innerHeight = height - topPadding - bottomPadding;
        const groupWidth = innerWidth / maxOvers;
        const barGap = maxOvers > 30 ? 1.5 : 5;
        const inningsCount = Math.max(1, overRows.length);
        const barWidth = Math.max(
            2.5,
            Math.min(28, (groupWidth * 0.74 - barGap * (inningsCount - 1)) / inningsCount),
        );
        const tickInterval = tickIntervalForOvers(maxOvers);
        const ticks = Array.from({ length: maxOvers + 1 }, (_, over) => ({
            over,
            x: padding + (over / maxOvers) * innerWidth,
        })).filter((tick) => tick.over % tickInterval === 0 || tick.over === maxOvers);

        return {
            width,
            height,
            padding,
            topPadding,
            bottomPadding,
            innerHeight,
            maxOverRuns,
            maxOvers,
            groupWidth,
            barGap,
            barWidth,
            inningsCount,
            ticks,
            innings: overRows,
        };
    }, [data]);

    if (!visible) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[77] font-sans">
            <div
                className={`absolute top-1/2 left-16 h-[620px] w-[980px] -translate-y-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#07111f] text-white shadow-2xl transition-all duration-700 ${show ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
            >
                <div className="absolute top-0 left-0 h-1.5 w-full bg-[#facc15]" />

                <div className="flex items-center justify-between border-b border-white/10 px-8 py-5">
                    <div>
                        <div className="mb-2 inline-flex rounded-sm bg-[#facc15] px-4 py-1 text-xs font-black tracking-[0.32em] text-black uppercase">
                            Over By Over
                        </div>
                        <h2 className="text-3xl font-black tracking-wide uppercase">
                            {data?.title || 'Over By Over Worm'}
                        </h2>
                    </div>

                    <button
                        className="pointer-events-auto h-8 w-8 rounded bg-white/10 text-sm font-black text-white hover:bg-white/20"
                        onClick={onClose}
                        type="button"
                    >
                        X
                    </button>
                </div>

                <div className="grid grid-cols-[1fr_230px] gap-5 px-8 py-6">
                    <svg
                        className="h-[360px] w-full overflow-visible"
                        viewBox={`0 0 ${chart.width} ${chart.height}`}
                    >
                        {chart.ticks.map((tick: any) => (
                            <g key={tick.over}>
                                <line
                                    x1={tick.x}
                                    x2={tick.x}
                                    y1={chart.topPadding}
                                    y2={chart.height - chart.bottomPadding}
                                    stroke="rgba(255,255,255,0.08)"
                                />
                                <text
                                    x={tick.x}
                                    y={chart.height - chart.bottomPadding + 24}
                                    textAnchor="middle"
                                    className="fill-slate-300 text-[12px] font-black"
                                >
                                    {tick.over}
                                </text>
                            </g>
                        ))}

                        {[0.25, 0.5, 0.75, 1].map((fraction) => {
                            const y =
                                chart.height -
                                chart.bottomPadding -
                                fraction * chart.innerHeight;
                            const value = Math.round(chart.maxOverRuns * fraction);

                            return (
                                <g key={fraction}>
                                    <line
                                        x1={chart.padding}
                                        x2={chart.width - chart.padding}
                                        y1={y}
                                        y2={y}
                                        stroke="rgba(255,255,255,0.10)"
                                    />
                                    <text
                                        x={chart.padding - 12}
                                        y={y + 4}
                                        textAnchor="end"
                                        className="fill-slate-400 text-[11px] font-bold"
                                    >
                                        {value}
                                    </text>
                                </g>
                            );
                        })}

                        <line
                            x1={chart.padding}
                            x2={chart.padding}
                            y1={chart.topPadding}
                            y2={chart.height - chart.bottomPadding}
                            stroke="rgba(255,255,255,0.25)"
                        />
                        <line
                            x1={chart.padding}
                            x2={chart.width - chart.padding}
                            y1={chart.height - chart.bottomPadding}
                            y2={chart.height - chart.bottomPadding}
                            stroke="rgba(255,255,255,0.25)"
                        />

                        {chart.innings.map((inning: any, inningIndex: number) =>
                            inning.overBreakdown.map((over: any) => {
                                const x =
                                    chart.padding +
                                    (over.over - 1) * chart.groupWidth +
                                    (chart.groupWidth -
                                        (chart.barWidth * chart.inningsCount +
                                            chart.barGap * (chart.inningsCount - 1))) /
                                        2 +
                                    inningIndex * (chart.barWidth + chart.barGap);
                                const barHeight =
                                    ((over.runs || 0) / chart.maxOverRuns) *
                                    chart.innerHeight;
                                const y =
                                    chart.height -
                                    chart.bottomPadding -
                                    Math.max(2, barHeight);

                                return (
                                    <g key={`${inning.teamName}-${over.over}`}>
                                        <rect
                                            x={x}
                                            y={y}
                                            width={chart.barWidth}
                                            height={Math.max(2, barHeight)}
                                            rx="3"
                                            fill={inning.color}
                                        />
                                        {over.wickets > 0 && (
                                            <circle
                                                cx={x + chart.barWidth / 2}
                                                cy={y - 8}
                                                r="5"
                                                fill="#fb7185"
                                            />
                                        )}
                                    </g>
                                );
                            }),
                        )}

                        <text
                            x={chart.width / 2}
                            y={chart.height - 12}
                            textAnchor="middle"
                            className="fill-slate-400 text-[12px] font-black uppercase tracking-widest"
                        >
                            Overs
                        </text>
                    </svg>

                    <div className="flex flex-col gap-3">
                        {chart.innings.map((inning: any) => {
                            const bestOver = [...(inning.overBreakdown || [])].sort(
                                (a: any, b: any) => (b.runs || 0) - (a.runs || 0),
                            )[0];

                            return (
                                <div
                                    key={inning.teamName}
                                    className="rounded border border-white/10 bg-white/5 p-4"
                                >
                                    <div className="mb-2 flex items-center gap-2">
                                        <span
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: inning.color }}
                                        />
                                        <span className="truncate text-sm font-black uppercase">
                                            {inning.teamName}
                                        </span>
                                    </div>
                                    <div className="text-3xl font-black">
                                        {inning.score}
                                    </div>
                                    <div className="mt-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                                        {inning.overs} overs
                                    </div>
                                    {bestOver && (
                                        <div className="mt-4 rounded bg-black/25 px-3 py-2">
                                            <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                                Best over
                                            </div>
                                            <div className="mt-1 text-lg font-black">
                                                Over {bestOver.over}: {bestOver.runs} runs
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mx-8 grid grid-cols-1 gap-3 border-t border-white/10 pt-4">
                    {chart.innings.map((inning: any) => (
                        <div
                            key={`${inning.teamName}-details`}
                            className="flex items-center gap-3 overflow-hidden"
                        >
                            <div
                                className="w-28 shrink-0 truncate text-xs font-black tracking-widest uppercase"
                                style={{ color: inning.color }}
                            >
                                {inning.teamName}
                            </div>
                            <div className="flex min-w-0 gap-2 overflow-hidden">
                                {(inning.overBreakdown || []).slice(-8).map((over: any) => (
                                    <div
                                        key={`${inning.teamName}-${over.over}-card`}
                                        className="min-w-[78px] rounded border border-white/10 bg-white/5 px-3 py-2"
                                    >
                                        <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                            Over {over.over}
                                        </div>
                                        <div className="mt-1 text-lg font-black">
                                            +{over.runs}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400">
                                            {over.totalRuns}/{over.totalWickets}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
