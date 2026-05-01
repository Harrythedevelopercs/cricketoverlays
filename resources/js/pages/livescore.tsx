import { Head } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    CircleDot,
    Clock3,
    CloudRain,
    Eye,
    Flame,
    LineChart,
    Medal,
    Radio,
    Shield,
    Sparkles,
    Target,
    Trophy,
    Users,
    Zap,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import livestreamRoute from '@/routes/livestream';
import type { BreadcrumbItem } from '@/types';

const streamId = 2;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Live Scores',
        href: livestreamRoute.show(streamId),
    },
];

const csrfToken = () =>
    document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    '';

const postOverlay = async (path: string) => {
    await fetch(path, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': csrfToken(),
        },
    });
};

const logoSrc = (path?: string) => (path ? `/storage/${path}` : undefined);

const buttonStyles: Record<string, string> = {
    live: 'border-sky-400/30 bg-sky-500/10 text-sky-100 hover:border-sky-300 hover:bg-sky-500/20',
    impact:
        'border-amber-300/40 bg-amber-400/15 text-amber-50 hover:border-amber-200 hover:bg-amber-400/25',
    danger:
        'border-rose-400/40 bg-rose-500/15 text-rose-50 hover:border-rose-300 hover:bg-rose-500/25',
    calm: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-50 hover:border-emerald-300 hover:bg-emerald-500/20',
    neutral:
        'border-white/10 bg-white/[0.06] text-slate-100 hover:border-white/25 hover:bg-white/[0.11]',
};

function ControlButton({ item }: any) {
    const Icon = item.icon || CircleDot;
    const tone = item.tone || 'neutral';

    return (
        <button
            type="button"
            onClick={item.action || (() => {})}
            className={`group relative min-h-[84px] overflow-hidden rounded-lg border p-4 text-left shadow-sm transition-all duration-300 ${buttonStyles[tone]} hover:-translate-y-0.5 hover:shadow-lg`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-black/25 ring-1 ring-white/10">
                    <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-black tracking-widest text-slate-300 uppercase">
                    {item.action ? 'Ready' : 'Panel'}
                </span>
            </div>
            <div className="mt-4 text-sm font-black tracking-wide uppercase">
                {item.title}
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-400">
                {item.description || 'Broadcast overlay control'}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-current opacity-70 transition-transform duration-300 group-hover:scale-x-100" />
        </button>
    );
}

function Section({ title, eyebrow, children }: any) {
    return (
        <section className="rounded-xl border border-white/10 bg-[#11141b] p-5 shadow-xl shadow-black/10">
            <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                    <div className="text-[11px] font-black tracking-[0.24em] text-amber-300 uppercase">
                        {eyebrow}
                    </div>
                    <h2 className="mt-1 text-lg font-black tracking-wide text-white uppercase">
                        {title}
                    </h2>
                </div>
            </div>
            {children}
        </section>
    );
}

function TeamPanel({ label, name, logo, accent, actions }: any) {
    return (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#151922]">
            <div
                className="h-1.5"
                style={{ backgroundColor: accent || '#38bdf8' }}
            />
            <div className="grid gap-5 p-5 sm:grid-cols-[120px_1fr]">
                <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-white p-3 shadow-inner">
                    {logo ? (
                        <img
                            src={logo}
                            alt={name}
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <Shield className="h-12 w-12 text-slate-400" />
                    )}
                </div>
                <div className="min-w-0">
                    <div className="text-xs font-black tracking-[0.28em] text-slate-400 uppercase">
                        {label}
                    </div>
                    <h3 className="mt-2 truncate text-2xl font-black text-white uppercase">
                        {name}
                    </h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {actions.map((item: any) => (
                            <ControlButton key={item.title} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LiveScores({ livestream }: any) {
    const streamID = livestream.live_stream_id;
    const actionGroups = [
        {
            title: 'Match Events',
            eyebrow: 'Instant triggers',
            items: [
                {
                    title: 'Four',
                    description: 'Boundary overlay',
                    icon: Flame,
                    tone: 'impact',
                    action: () => postOverlay(`/livestream/four/${streamID}`),
                },
                {
                    title: 'Six',
                    description: 'Maximum overlay',
                    icon: Zap,
                    tone: 'impact',
                    action: () => postOverlay(`/livestream/six/${streamID}`),
                },
                {
                    title: 'Wicket',
                    description: 'Wicket animation',
                    icon: Target,
                    tone: 'danger',
                    action: () => postOverlay(`/livestream/wicket/${streamID}`),
                },
                {
                    title: 'Intro',
                    description: 'Match intro screen',
                    icon: Trophy,
                    tone: 'live',
                    action: () =>
                        postOverlay(`/livestream/match-intro/${streamID}`),
                },
                {
                    title: 'Innings Break',
                    description: 'Break overlay',
                    icon: Clock3,
                    tone: 'calm',
                    action: () =>
                        postOverlay(`/livestream/innings-break/${streamID}`),
                },
                {
                    title: 'Drinks Break',
                    description: 'Drinks overlay',
                    icon: Activity,
                    tone: 'calm',
                    action: () =>
                        postOverlay(`/livestream/drinks-break/${streamID}`),
                },
                {
                    title: 'Rain Delay',
                    description: 'Weather hold',
                    icon: CloudRain,
                },
                {
                    title: 'Hide',
                    description: 'Clear overlays',
                    icon: Eye,
                },
            ],
        },
        {
            title: 'Player Overlays',
            eyebrow: 'Current players',
            items: [
                {
                    title: 'Batsman Stats',
                    icon: BarChart3,
                    action: () =>
                        postOverlay(`/livestream/batsman-stats/${streamID}`),
                },
                {
                    title: 'Runner Stats',
                    icon: BarChart3,
                    action: () =>
                        postOverlay(`/livestream/runner-stats/${streamID}`),
                },
                {
                    title: 'Bowler Stats',
                    icon: BarChart3,
                },
                {
                    title: 'Out Batsman',
                    icon: Users,
                },
                {
                    title: 'Batsman Career',
                    icon: Medal,
                    action: () =>
                        postOverlay(`/livestream/batsman-career/${streamID}`),
                },
                {
                    title: 'Runner Career',
                    icon: Medal,
                    action: () =>
                        postOverlay(`/livestream/runner-career/${streamID}`),
                },
                {
                    title: 'Bowler Career',
                    icon: Medal,
                    action: () =>
                        postOverlay(`/livestream/bowler-career/${streamID}`),
                },
                {
                    title: 'Out Batsman Career',
                    icon: Medal,
                },
                {
                    title: 'Batsman Series',
                    icon: Trophy,
                },
                {
                    title: 'Runner Series',
                    icon: Trophy,
                },
                {
                    title: 'Bowler Series',
                    icon: Trophy,
                },
                {
                    title: 'Out Batsman Series',
                    icon: Trophy,
                },
            ],
        },
        {
            title: 'Analysis',
            eyebrow: 'Match graphics',
            items: [
                {
                    title: 'Partnership',
                    icon: Users,
                    tone: 'live',
                    action: () =>
                        postOverlay(`/livestream/partnership/${streamID}`),
                },
                {
                    title: 'Points Table',
                    icon: Trophy,
                },
                {
                    title: 'Over by Over',
                    icon: BarChart3,
                    tone: 'live',
                    action: () =>
                        postOverlay(`/livestream/over-by-over/${streamID}`),
                },
                {
                    title: 'Worm',
                    icon: LineChart,
                    tone: 'live',
                    action: () => postOverlay(`/livestream/worm/${streamID}`),
                },
                {
                    title: 'Player of the Match',
                    icon: Medal,
                },
                {
                    title: 'Target',
                    icon: Target,
                },
                {
                    title: 'Run Rate',
                    icon: Activity,
                },
                {
                    title: 'Team 1',
                    icon: Shield,
                },
                {
                    title: 'Team 2',
                    icon: Shield,
                },
                {
                    title: 'At this stage',
                    icon: CircleDot,
                },
                {
                    title: 'Projected Scores',
                    icon: LineChart,
                },
                {
                    title: 'This Over',
                    icon: Activity,
                    tone: 'live',
                    action: () => postOverlay(`/livestream/this-over/${streamID}`),
                },
                {
                    title: 'Par Score',
                    icon: Target,
                },
                {
                    title: 'replay',
                    icon: Eye,
                },
                {
                    title: 'Projected Scores',
                    icon: LineChart,
                },
                {
                    title: 'Sponsors',
                    icon: Sparkles,
                },
            ],
        },
    ];

    const teamOneActions = [
        { title: 'Batting', icon: BarChart3 },
        { title: 'Bowling', icon: Activity },
        {
            title: 'Squad List One',
            description: 'Show team sheet',
            icon: Users,
            tone: 'live',
            action: () => postOverlay(`/livestream/squad-one-list/${streamID}`),
        },
        { title: 'Squad', icon: Shield },
    ];

    const teamTwoActions = [
        { title: 'Batting', icon: BarChart3 },
        { title: 'Bowling', icon: Activity },
        {
            title: 'Squad List Two',
            description: 'Show team sheet',
            icon: Users,
            tone: 'live',
            action: () => postOverlay(`/livestream/squad-two-list/${streamID}`),
        },
        { title: 'Squad', icon: Shield },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Live Scores" />
            <div className="min-h-full bg-[#0c0f14] p-4 text-slate-100 md:p-6">
                <div className="mx-auto flex max-w-[1500px] flex-col gap-6">
                    <header className="overflow-hidden rounded-xl border border-white/10 bg-[#141820] shadow-2xl shadow-black/20">
                        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="p-6 md:p-8">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-black tracking-[0.24em] text-emerald-200 uppercase">
                                    <Radio className="h-4 w-4" />
                                    Live Control Room
                                </div>
                                <h1 className="text-3xl font-black tracking-tight text-white uppercase md:text-5xl">
                                    {livestream.title || 'Match Overlay Controls'}
                                </h1>
                                <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-slate-300">
                                    <span className="rounded-md bg-white/[0.06] px-3 py-2">
                                        Stream: {streamID}
                                    </span>
                                    {livestream.tournament_name && (
                                        <span className="rounded-md bg-white/[0.06] px-3 py-2">
                                            {livestream.tournament_name}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-white/10 bg-black/15 p-6 lg:border-t-0 lg:border-l">
                                <div className="min-w-0 text-center">
                                    <img
                                        src={logoSrc(livestream.team_one_logo)}
                                        alt={livestream.team_one_title}
                                        className="mx-auto h-20 w-20 rounded-lg bg-white p-2 object-contain"
                                    />
                                    <div className="mt-3 truncate text-sm font-black uppercase">
                                        {livestream.team_one_title}
                                    </div>
                                </div>
                                <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-lg font-black text-amber-200">
                                    VS
                                </div>
                                <div className="min-w-0 text-center">
                                    <img
                                        src={logoSrc(livestream.team_two_logo)}
                                        alt={livestream.team_two_title}
                                        className="mx-auto h-20 w-20 rounded-lg bg-white p-2 object-contain"
                                    />
                                    <div className="mt-3 truncate text-sm font-black uppercase">
                                        {livestream.team_two_title}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <Section title="Primary Surfaces" eyebrow="Always on screen">
                        <div className="grid gap-4 md:grid-cols-4">
                            {[
                                'Scorebar',
                                'Custom Text',
                                'Current Scenario',
                                'Current Batters',
                                'L-Scorecard',
                            ].map((title) => (
                                <ControlButton
                                    key={title}
                                    item={{
                                        title,
                                        icon: title === 'Scorebar' ? Radio : Activity,
                                    }}
                                />
                            ))}
                        </div>
                    </Section>

                    <div className="grid gap-5 xl:grid-cols-2">
                        <TeamPanel
                            label="Team One"
                            name={livestream.team_one_title}
                            logo={logoSrc(livestream.team_one_logo)}
                            accent={livestream.team_one_primary_color}
                            actions={teamOneActions}
                        />
                        <TeamPanel
                            label="Team Two"
                            name={livestream.team_two_title}
                            logo={logoSrc(livestream.team_two_logo)}
                            accent={livestream.team_two_primary_color}
                            actions={teamTwoActions}
                        />
                    </div>

                    {actionGroups.map((group) => (
                        <Section
                            key={group.title}
                            title={group.title}
                            eyebrow={group.eyebrow}
                        >
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                                {group.items.map((item: any, index: number) => (
                                    <ControlButton
                                        key={`${item.title}-${index}`}
                                        item={item}
                                    />
                                ))}
                            </div>
                        </Section>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
