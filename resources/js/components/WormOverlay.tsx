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

export default function WormOverlay({ show, data, onClose }: any) {
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
        const allPoints = innings.flatMap((inning: any) => inning.points || []);
        const maxRuns = Math.max(20, ...allPoints.map((point: any) => point.runs || 0));
        const maxOvers = Math.max(5, ...allPoints.map((point: any) => point.over || 0));
        const width = 720;
        const height = 330;
        const padding = 50;
        const topPadding = 34;
        const bottomPadding = 66;
        const innerWidth = width - padding * 2;
        const innerHeight = height - topPadding - bottomPadding;

        const pointToXY = (point: any) => {
            const x = padding + ((point.over || 0) / maxOvers) * innerWidth;
            const y = height - bottomPadding - ((point.runs || 0) / maxRuns) * innerHeight;

            return [x, y];
        };

        const tickInterval = tickIntervalForOvers(maxOvers);
        const overTicks = Array.from({ length: Math.floor(maxOvers) + 1 }, (_, over) => ({
            over,
            x: padding + (over / maxOvers) * innerWidth,
        })).filter((tick) => tick.over % tickInterval === 0 || tick.over === Math.floor(maxOvers));

        return {
            width,
            height,
            padding,
            topPadding,
            bottomPadding,
            maxRuns,
            maxOvers,
            overTicks,
            lines: innings.map((inning: any, index: number) => ({
                ...inning,
                color: COLORS[index % COLORS.length],
                path: (inning.points || [])
                    .map((point: any, pointIndex: number) => {
                        const [x, y] = pointToXY(point);

                        return `${pointIndex === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' '),
                points: (inning.points || []).map((point: any) => ({
                    ...point,
                    xy: pointToXY(point),
                })),
                latestPoint: (inning.points || [])[Math.max((inning.points || []).length - 1, 0)],
            })),
        };
    }, [data]);

    if (!visible) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[76] font-sans">
            <div
                className={`absolute top-1/2 left-16 h-[620px] w-[940px] -translate-y-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#07111f] text-white shadow-2xl transition-all duration-700 ${show ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
            >
                <div className="absolute top-0 left-0 h-1.5 w-full bg-[#38bdf8]" />

                <div className="flex items-center justify-between border-b border-white/10 px-8 py-5">
                    <div>
                        <div className="mb-2 inline-flex rounded-sm bg-[#38bdf8] px-4 py-1 text-xs font-black tracking-[0.32em] text-black uppercase">
                            Worm
                        </div>
                        <h2 className="text-3xl font-black tracking-wide uppercase">
                            {data?.title || 'Match Worm'}
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

                <div className="grid grid-cols-[1fr_220px] gap-5 px-8 py-6">
                    <svg
                        className="h-[360px] w-full overflow-visible"
                        viewBox={`0 0 ${chart.width} ${chart.height}`}
                    >
                        {chart.overTicks.map((tick: any) => (
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
                                fraction *
                                    (chart.height - chart.topPadding - chart.bottomPadding);
                            const value = Math.round(chart.maxRuns * fraction);

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
                            y1={chart.padding}
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

                        {chart.lines.map((line: any) => (
                            <g key={line.teamName}>
                                <path
                                    d={line.path}
                                    fill="none"
                                    stroke={line.color}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                                {line.points.map((point: any) => (
                                    <circle
                                        key={`${line.teamName}-${point.over}`}
                                        cx={point.xy[0]}
                                        cy={point.xy[1]}
                                        fill={line.color}
                                        r="4"
                                    />
                                ))}
                            </g>
                        ))}

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
                        {chart.lines.map((line: any) => (
                            <div
                                key={line.teamName}
                                className="rounded border border-white/10 bg-white/5 p-4"
                            >
                                <div className="mb-2 flex items-center gap-2">
                                    <span
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: line.color }}
                                    />
                                    <span className="truncate text-sm font-black uppercase">
                                        {line.teamName}
                                    </span>
                                </div>
                                <div className="text-3xl font-black">
                                    {line.score}
                                </div>
                                <div className="mt-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                                    {line.overs} overs
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mx-8 grid grid-cols-1 gap-3 border-t border-white/10 pt-4">
                    {chart.lines.map((line: any) => {
                        const points = line.points || [];
                        const recentPoints = points.slice(-6);

                        return (
                            <div
                                key={`${line.teamName}-overs`}
                                className="flex items-center gap-3 overflow-hidden"
                            >
                                <div
                                    className="w-28 shrink-0 truncate text-xs font-black tracking-widest uppercase"
                                    style={{ color: line.color }}
                                >
                                    {line.teamName}
                                </div>
                                <div className="flex min-w-0 gap-2 overflow-hidden">
                                    {recentPoints.map((point: any, index: number) => {
                                        const previous = recentPoints[index - 1] || points[points.indexOf(point) - 1];
                                        const overRuns = Math.max(
                                            0,
                                            (point.runs || 0) - (previous?.runs || 0),
                                        );

                                        return (
                                            <div
                                                key={`${line.teamName}-${point.over}-detail`}
                                                className="min-w-[76px] rounded border border-white/10 bg-white/5 px-3 py-2"
                                            >
                                                <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                                    Over {point.over}
                                                </div>
                                                <div className="mt-1 text-lg font-black">
                                                    {point.runs}/{point.wickets}
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-400">
                                                    +{overRuns} runs
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
