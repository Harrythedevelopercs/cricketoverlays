import { Head } from '@inertiajs/react';
import type { ChangeEvent, FormEvent } from 'react';
import { useRef, useState } from 'react';
import AlertError from '@/components/alert-error';
import AppLayout from '@/layouts/app-layout';
import { createstream } from '@/routes';
import livestreamRoute from '@/routes/livestream';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Stream',
        href: createstream(),
    },
];

type CreateStreamResponse = {
    status?: boolean;
    message?: string;
    data?: string;
    errors?: Record<string, string[]>;
};

const csrfToken = () =>
    document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content') || '';

const responseErrors = (
    data: CreateStreamResponse | null,
    fallback: string,
) => {
    const validationErrors = data?.errors
        ? Object.values(data.errors).flat()
        : [];

    return validationErrors.length
        ? validationErrors
        : [data?.message || fallback];
};

export default function Createstream() {
    const [teamOneColorPrimary, setTeamOneColorPrimary] = useState('#ffffff');
    const [teamOneColorSecondary, setTeamOneColorSecondary] =
        useState('#ffffff');
    const [teamTwoColorPrimary, setTeamTwoColorPrimary] = useState('#ffffff');
    const [teamTwoColorSecondary, setTeamTwoColorSecondary] =
        useState('#ffffff');
    const [uiColorPrimary, setUiColorPrimary] = useState('#ffffff');
    const [uiColorSecondary, setUiColorSecondary] = useState('#ffffff');
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const [previewTwo, setPreviewTwo] = useState<string | null>(null);
    const fileInputRefTwo = useRef<HTMLInputElement>(null);

    const handleClickTwo = () => {
        fileInputRefTwo.current?.click();
    };

    const handleImageChangeTwo = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewTwo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const createLiveStream = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setErrors([]);
        setIsSubmitting(true);

        try {
            const response = await fetch(livestreamRoute.store.url(), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken(),
                    Accept: 'application/json',
                },
                body: formData,
            });

            const data = (await response
                .json()
                .catch(() => null)) as CreateStreamResponse | null;

            if (!response.ok) {
                setErrors(
                    responseErrors(
                        data,
                        'Stream create nahi ho saki. Please form details check karein aur dobara try karein.',
                    ),
                );

                return;
            }

            if (data?.status && data.data) {
                window.location.href = livestreamRoute.show.url(data.data);
                return;
            }

            setErrors(
                responseErrors(
                    data,
                    'Stream create nahi ho saki. Please dobara try karein.',
                ),
            );
        } catch (error) {
            console.log(error);
            setErrors([
                'Network error ki wajah se stream create nahi ho saki. Please connection check karein aur dobara try karein.',
            ]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Stream" />
            <div className="flex h-full flex-1 flex-col gap-1 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 py-6.5 md:grid-cols-1">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48] p-5 duration-500 dark:border-sidebar-border">
                        <div className="stroke-neutral-900/20 dark:stroke-neutral-100/20">
                            <h2 className="text-center text-[2.25rem] font-semibold text-white uppercase">
                                TEAMS Configrations
                            </h2>
                        </div>
                    </div>
                </div>
                <form
                    id="livestreamForm"
                    onSubmit={createLiveStream}
                    encType="multipart/form-data"
                >
                    {errors.length > 0 && (
                        <div className="mb-4">
                            <AlertError
                                title="Stream create nahi ho saki."
                                errors={errors}
                            />
                        </div>
                    )}

                    <div className="grid gap-4 py-6.5 md:grid-cols-2">
                        <div className="rounded-xl border-2 border-[#3f3b48] p-4">
                            <h2 className="text-center text-[2.25rem] font-semibold text-black uppercase">
                                TEAM One
                            </h2>
                            <div className="flex flex-col items-center gap-2">
                                <input
                                    type="file"
                                    id="teamOneLogo"
                                    name="teamOneLogo"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <div
                                    className="h-50 w-50 cursor-pointer rounded-full bg-[#3f3b48] bg-cover bg-center transition-all hover:opacity-90"
                                    style={{
                                        backgroundImage: preview
                                            ? `url(${preview})`
                                            : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                    onClick={handleClick}
                                >
                                    {!preview && (
                                        <div className="flex h-full w-full items-center justify-center text-white/80">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-12 w-12"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-5 grid auto-rows-min gap-4 md:grid-cols-2">
                                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="teamOneName">
                                            Team One Name
                                        </label>
                                        <input
                                            type="text"
                                            id="teamOneName"
                                            required
                                            name="teamOneName"
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Enter Team One Name"
                                        />
                                    </div>
                                </div>
                                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="teamOneID">
                                            Team One ID
                                        </label>
                                        <input
                                            type="number"
                                            id="teamOneID"
                                            name="teamOneID"
                                            required
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Enter Team One ID"
                                        />
                                    </div>
                                </div>
                                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="teamOneColorPrimary">
                                            Team One Primary Color{' '}
                                        </label>
                                        <input
                                            type="color"
                                            id="teamOneColorPrimary"
                                            name="teamOneColorPrimary"
                                            required
                                            value={teamOneColorPrimary}
                                            onChange={(e) =>
                                                setTeamOneColorPrimary(
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-full rounded-md border border-gray-300 px-3 py-5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                                            placeholder="Enter Team One Color"
                                            style={{
                                                backgroundColor:
                                                    teamOneColorPrimary,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="teamOneColorSecondary">
                                            Team One Secondary Color{' '}
                                        </label>
                                        <input
                                            type="color"
                                            id="teamOneColorSecondary"
                                            name="teamOneColorSecondary"
                                            required
                                            value={teamOneColorSecondary}
                                            onChange={(e) =>
                                                setTeamOneColorSecondary(
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-full rounded-md border border-gray-300 px-3 py-5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                                            placeholder="Enter Team One Color"
                                            style={{
                                                backgroundColor:
                                                    teamOneColorSecondary,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border-2 border-[#3f3b48] p-4">
                            <h2 className="text-center text-[2.25rem] font-semibold text-black uppercase">
                                TEAM Two
                            </h2>
                            <div className="flex flex-col items-center gap-2">
                                <input
                                    type="file"
                                    id="teamTwoLogo"
                                    name="teamTwoLogo"
                                    ref={fileInputRefTwo}
                                    accept="image/*"
                                    onChange={handleImageChangeTwo}
                                    className="hidden"
                                />
                                <div
                                    className="h-50 w-50 cursor-pointer rounded-full bg-[#3f3b48] bg-cover bg-center transition-all hover:opacity-90"
                                    style={{
                                        backgroundImage: previewTwo
                                            ? `url(${previewTwo})`
                                            : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                    onClick={handleClickTwo}
                                >
                                    {!previewTwo && (
                                        <div className="flex h-full w-full items-center justify-center text-white/80">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-12 w-12"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-5 grid auto-rows-min gap-4 md:grid-cols-2">
                                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="teamTwoName">
                                            Team Two Name
                                        </label>
                                        <input
                                            type="text"
                                            id="teamTwoName"
                                            required
                                            name="teamTwoName"
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Enter Team Two Name"
                                        />
                                    </div>
                                </div>
                                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="teamTwoID">
                                            Team Two ID
                                        </label>
                                        <input
                                            type="number"
                                            id="teamTwoID"
                                            name="teamTwoID"
                                            required
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Enter Team Two ID"
                                        />
                                    </div>
                                </div>
                                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="teamTwoColorPrimary">
                                            Team Two Primary Color{' '}
                                        </label>
                                        <input
                                            type="color"
                                            id="teamTwoColorPrimary"
                                            name="teamTwoColorPrimary"
                                            required
                                            value={teamTwoColorPrimary}
                                            onChange={(e) =>
                                                setTeamTwoColorPrimary(
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-full rounded-md border border-gray-300 px-3 py-5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                                            placeholder="Enter Team Two Primary Color"
                                            style={{
                                                backgroundColor:
                                                    teamTwoColorPrimary,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="teamTwoColorSecondary">
                                            Team Two Secondary Color{' '}
                                        </label>
                                        <input
                                            type="color"
                                            id="teamTwoColorSecondary"
                                            name="teamTwoColorSecondary"
                                            required
                                            value={teamTwoColorSecondary}
                                            onChange={(e) =>
                                                setTeamTwoColorSecondary(
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-full rounded-md border border-gray-300 px-3 py-5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                                            placeholder="Enter Team Two Secondary Color"
                                            style={{
                                                backgroundColor:
                                                    teamTwoColorSecondary,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 py-6.5 md:grid-cols-1">
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48] p-5 duration-500 dark:border-sidebar-border">
                            <div className="stroke-neutral-900/20 dark:stroke-neutral-100/20">
                                <h2 className="text-center text-[2.25rem] font-semibold text-white uppercase">
                                    UI Panel Configrations
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 py-6.5 md:grid-cols-5">
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="UIColorPrimary">
                                    UI Primary Color{' '}
                                </label>
                                <input
                                    type="color"
                                    id="UIColorPrimary"
                                    name="UIColorPrimary"
                                    required
                                    value={uiColorPrimary}
                                    onChange={(e) =>
                                        setUiColorPrimary(e.target.value)
                                    }
                                    className={`w-full rounded-md border border-gray-300 px-3 py-5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                                    placeholder="Enter Team One Color"
                                    style={{ backgroundColor: uiColorPrimary }}
                                />
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="UIColorSecondary">
                                    UI Secondary Color{' '}
                                </label>
                                <input
                                    type="color"
                                    id="UIColorSecondary"
                                    name="UIColorSecondary"
                                    required
                                    value={uiColorSecondary}
                                    onChange={(e) =>
                                        setUiColorSecondary(e.target.value)
                                    }
                                    className={`w-full rounded-md border border-gray-300 px-3 py-5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                                    placeholder="Enter Team One Color"
                                    style={{
                                        backgroundColor: uiColorSecondary,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="matchId">Match Id</label>
                                <input
                                    type="text"
                                    id="matchId"
                                    required
                                    name="matchId"
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter Match Id"
                                />
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="clubId">Club Id</label>
                                <input
                                    type="text"
                                    id="clubId"
                                    required
                                    name="clubId"
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter Club Id"
                                />
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-[#3f3b48]/10 p-5 duration-500 dark:border-sidebar-border">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="MatchType">Match Type</label>
                                <select
                                    name="MatchType"
                                    id="MatchType"
                                    className="rounded-md bg-white p-3"
                                >
                                    <option value="1day">1 Day</option>
                                    <option value="t20">T20</option>
                                    <option value="t10">T10</option>
                                    <option value="practice">Practice</option>
                                    <option value="test">Test</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-md bg-[#3f3b48] px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting
                                ? 'Creating Stream...'
                                : 'Create Stream'}
                        </button>
                    </div>
                </form>
            </div>
            <script></script>
        </AppLayout>
    );
}
