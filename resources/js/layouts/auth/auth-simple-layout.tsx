import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh items-center justify-center bg-[#f4f7fb] p-4 text-slate-950 md:p-8">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="hidden bg-[#101820] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <Link
                        href={home()}
                        className="flex items-center gap-3 font-semibold"
                    >
                        <img
                            src="https://www.clubcricketofchicago.com/_next/image?url=%2Fimages%2Flogo.png&w=256&q=75"
                            alt="Club Cricket of Chicago"
                            className="h-12 w-12 rounded-lg bg-white p-1.5"
                        />
                        <span className="text-lg">Club Cricket of Chicago</span>
                    </Link>

                    <div>
                        <div className="mb-4 h-1.5 w-24 rounded-full bg-[#f5c542]" />
                        <h2 className="text-4xl leading-tight font-black tracking-tight">
                            Match overlays control room
                        </h2>
                        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                            Sign in to manage live cricket broadcasts, score
                            panels, and match graphics.
                        </p>
                    </div>

                    <div className="text-xs font-semibold tracking-[0.28em] text-slate-400 uppercase">
                        CCC Overlays
                    </div>
                </div>

                <div className="flex min-h-[640px] items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-sm">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <Link
                                    href={home()}
                                    className="flex flex-col items-center gap-3 font-medium"
                                >
                                    <img
                                        src="https://www.clubcricketofchicago.com/_next/image?url=%2Fimages%2Flogo.png&w=256&q=75"
                                        alt="Club Cricket of Chicago"
                                        className="h-16 w-16 rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
                                    />
                                    <span className="text-base font-black tracking-wide text-slate-950 uppercase">
                                        Club Cricket of Chicago
                                    </span>
                                </Link>

                                <div className="space-y-2 text-center">
                                    <h1 className="text-2xl font-black tracking-tight">
                                        {title}
                                    </h1>
                                    <p className="text-center text-sm leading-6 text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
