import { Head, Link } from '@inertiajs/react';
import { Activity, ExternalLink, Radio, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Old Matches',
        href: '/old-matches',
    },
];

type BallRecord = {
    id: number;
    innings?: number;
    teamName?: string;
    over?: number;
    ball?: number;
    runs?: number;
    display?: string;
    type?: string;
    commentary?: string;
};

type MatchRecord = {
    id: number;
    title: string;
    liveStreamId: string;
    matchId?: number;
    clubId?: number;
    matchType?: string;
    scorebarStyle?: string;
    status?: string;
    result?: string;
    teamOne: {
        name: string;
        logo?: string | null;
    };
    teamTwo: {
        name: string;
        logo?: string | null;
    };
    ballsCount: number;
    createdAt?: string;
    updatedAt?: string;
    recentBalls: BallRecord[];
};

type PaginatedMatches = {
    data: MatchRecord[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

const logoFallback = (name: string) =>
    `https://placehold.co/80x80/3f3b48/ffffff?text=${encodeURIComponent(
        name.slice(0, 2).toUpperCase(),
    )}`;

const ballText = (ball: BallRecord) => {
    const over = ball.over ?? 0;
    const delivery = ball.ball ?? 0;

    return `${over}.${delivery}`;
};

export default function OldMatches({ matches }: { matches: PaginatedMatches }) {
    const [query, setQuery] = useState('');

    const filteredMatches = useMemo(() => {
        const term = query.trim().toLowerCase();

        if (!term) {
            return matches.data;
        }

        return matches.data.filter((match) =>
            [
                match.title,
                match.teamOne.name,
                match.teamTwo.name,
                match.matchId,
                match.clubId,
                match.status,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(term)),
        );
    }, [matches.data, query]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Old Matches" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-4">
                <div className="rounded-lg border border-sidebar-border/70 bg-[#111722] p-5 text-white shadow-sm">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-[#f6c84c] uppercase">
                                <Activity className="h-4 w-4" />
                                Match Archive
                            </div>
                            <h1 className="mt-2 text-3xl font-black tracking-tight">
                                Old Matches Data
                            </h1>
                            <p className="mt-1 text-sm text-white/65">
                                Streams, teams, saved ball-by-ball records, aur
                                recent deliveries yahan dekh sakte hain.
                            </p>
                        </div>
                        <div className="relative w-full md:w-[340px]">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/45" />
                            <input
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Search match, team, match id..."
                                className="w-full rounded-md border border-white/10 bg-white/10 py-3 pr-4 pl-10 text-sm text-white placeholder:text-white/45 focus:border-[#f6c84c] focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                    {filteredMatches.map((match) => (
                        <div
                            key={match.id}
                            className="overflow-hidden rounded-lg border border-sidebar-border/70 bg-white shadow-sm"
                        >
                            <div className="flex flex-col gap-4 border-b border-gray-200 bg-[#f6f7f9] p-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex min-w-0 items-center gap-4">
                                    <div className="flex -space-x-3">
                                        <img
                                            src={
                                                match.teamOne.logo ||
                                                logoFallback(match.teamOne.name)
                                            }
                                            alt={match.teamOne.name}
                                            className="h-14 w-14 rounded-full border-2 border-white bg-white object-contain shadow-sm"
                                        />
                                        <img
                                            src={
                                                match.teamTwo.logo ||
                                                logoFallback(match.teamTwo.name)
                                            }
                                            alt={match.teamTwo.name}
                                            className="h-14 w-14 rounded-full border-2 border-white bg-white object-contain shadow-sm"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="truncate text-xl font-black text-[#111722] uppercase">
                                            {match.title}
                                        </h2>
                                        <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold text-gray-600 uppercase">
                                            <span>Match #{match.matchId}</span>
                                            <span>Club #{match.clubId}</span>
                                            <span>{match.matchType}</span>
                                            <span>{match.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                                    <Metric
                                        label="Balls"
                                        value={match.ballsCount}
                                    />
                                    <Metric
                                        label="Style"
                                        value={match.scorebarStyle || 'classic'}
                                    />
                                    <Metric
                                        label="Created"
                                        value={match.createdAt || '-'}
                                    />
                                    <Metric
                                        label="Updated"
                                        value={match.updatedAt || '-'}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 p-4 xl:grid-cols-[1fr_420px]">
                                <div className="overflow-hidden rounded-md border border-gray-200">
                                    <div className="grid grid-cols-[86px_1fr_76px_130px] bg-[#111722] px-3 py-2 text-xs font-bold tracking-[0.18em] text-white/65 uppercase">
                                        <span>Ball</span>
                                        <span>Details</span>
                                        <span>Runs</span>
                                        <span>Type</span>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {match.recentBalls.length > 0 ? (
                                            match.recentBalls.map((ball) => (
                                                <div
                                                    key={ball.id}
                                                    className="grid grid-cols-[86px_1fr_76px_130px] items-center gap-3 px-3 py-3 text-sm"
                                                >
                                                    <span className="font-black text-[#111722]">
                                                        {ballText(ball)}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <div className="truncate font-semibold text-gray-900">
                                                            {ball.commentary ||
                                                                ball.teamName ||
                                                                'Ball record'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Innings{' '}
                                                            {ball.innings ||
                                                                '-'}
                                                        </div>
                                                    </div>
                                                    <span className="text-lg font-black text-[#188cc8]">
                                                        {ball.display ??
                                                            ball.runs ??
                                                            '-'}
                                                    </span>
                                                    <span className="truncate text-xs font-bold text-gray-500 uppercase">
                                                        {ball.type || '-'}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-3 py-8 text-center text-sm text-gray-500">
                                                Is match ka ball-by-ball data
                                                abhi saved nahi hai.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between rounded-md border border-gray-200 bg-[#111722] p-4 text-white">
                                    <div>
                                        <div className="text-xs font-bold tracking-[0.18em] text-[#f6c84c] uppercase">
                                            Teams
                                        </div>
                                        <div className="mt-3 space-y-3">
                                            <TeamRow team={match.teamOne} />
                                            <TeamRow team={match.teamTwo} />
                                        </div>
                                        {match.result && (
                                            <div className="mt-4 rounded-md bg-white/10 p-3 text-sm">
                                                {match.result}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-5 grid grid-cols-2 gap-2">
                                        <Link
                                            href={`/livestream/${match.liveStreamId}`}
                                            className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold text-[#111722] transition hover:bg-[#f6c84c]"
                                        >
                                            <Radio className="h-4 w-4" />
                                            Controls
                                        </Link>
                                        <a
                                            href={`/live/${match.liveStreamId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            Live
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredMatches.length === 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
                        Koi match nahi mila.
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {matches.links.map((link) => (
                        <Link
                            key={`${link.label}-${link.url}`}
                            href={link.url || '#'}
                            preserveScroll
                            className={`rounded-md border px-3 py-2 text-sm font-bold ${
                                link.active
                                    ? 'border-[#111722] bg-[#111722] text-white'
                                    : 'border-gray-200 bg-white text-gray-700'
                            } ${!link.url ? 'pointer-events-none opacity-45' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

function Metric({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-md border border-gray-200 bg-white px-3 py-2">
            <div className="text-[10px] font-bold tracking-[0.16em] text-gray-500 uppercase">
                {label}
            </div>
            <div className="mt-1 max-w-[140px] truncate text-sm font-black text-[#111722]">
                {value}
            </div>
        </div>
    );
}

function TeamRow({ team }: { team: MatchRecord['teamOne'] }) {
    return (
        <div className="flex items-center gap-3 rounded-md bg-white/8 p-3">
            <img
                src={team.logo || logoFallback(team.name)}
                alt={team.name}
                className="h-10 w-10 rounded-full bg-white object-contain"
            />
            <div className="min-w-0 truncate text-sm font-black uppercase">
                {team.name}
            </div>
        </div>
    );
}
