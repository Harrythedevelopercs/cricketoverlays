import type { MutableRefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import BatsmanCareerOverlay from '@/components/BatsmanCareerOverlay';
import BatsmanStatsOverlay from '@/components/BatsmanStatsOverlay';
import DrinksBreakOverlay from '@/components/DrinksBreakOverlay';
import InningsBreakOverlay from '@/components/InningsBreakOverlay';
import OverByOverWormOverlay from '@/components/OverByOverWormOverlay';
import PartnershipOverlay from '@/components/PartnershipOverlay';
import Scorebar from '@/components/scorebar';
import SquadOverlay from '@/components/SquadOverlay';
import TeamOneStats from '@/components/TeamOneStats';
import ThisOverOverlay from '@/components/ThisOverOverlay';
import VersusOverlay from '@/components/VersusOverlay';
import WormOverlay from '@/components/WormOverlay';
import echo from '@/echo';
import Overlay from './Overlay';

const SCOREBAR_REFRESH_MS = 1000;
const OVERLAY_EVENT_POLL_MS = 1000;
const OVERLAY_AUTO_HIDE_MS = 5000;

export default function Live({ livestream }: { livestream: any }) {
    const [data, setData] = useState(livestream);
    const [scorebarData, setScorebarData] = useState<any>(null);
    const [squadData, setSquadData] = useState<any>(null);
    const [batsmanStatsData, setBatsmanStatsData] = useState<any>(null);
    const [runnerStatsData, setRunnerStatsData] = useState<any>(null);
    const [batsmanCareerData, setBatsmanCareerData] = useState<any>(null);
    const [runnerCareerData, setRunnerCareerData] = useState<any>(null);
    const [bowlerCareerData, setBowlerCareerData] = useState<any>(null);
    const [partnershipData, setPartnershipData] = useState<any>(null);
    const [thisOverData, setThisOverData] = useState<any>(null);
    const [wormData, setWormData] = useState<any>(null);
    const [eventType, setEventType] = useState<string | null>(null);
    const [showStats, setShowStats] = useState(false);
    const [showSquad, setShowSquad] = useState(false);
    const [showVersus, setShowVersus] = useState(false);
    const [showInningsBreak, setShowInningsBreak] = useState(false);
    const [showDrinksBreak, setShowDrinksBreak] = useState(false);
    const [showBatsmanStats, setShowBatsmanStats] = useState(false);
    const [showRunnerStats, setShowRunnerStats] = useState(false);
    const [showBatsmanCareer, setShowBatsmanCareer] = useState(false);
    const [showRunnerCareer, setShowRunnerCareer] = useState(false);
    const [showBowlerCareer, setShowBowlerCareer] = useState(false);
    const [showPartnership, setShowPartnership] = useState(false);
    const [showThisOver, setShowThisOver] = useState(false);
    const [showOverByOver, setShowOverByOver] = useState(false);
    const [showWorm, setShowWorm] = useState(false);
    const squadTimeoutRef = useRef<number | null>(null);
    const squadRequestRef = useRef(0);
    const batsmanStatsTimeoutRef = useRef<number | null>(null);
    const runnerStatsTimeoutRef = useRef<number | null>(null);
    const batsmanCareerTimeoutRef = useRef<number | null>(null);
    const runnerCareerTimeoutRef = useRef<number | null>(null);
    const bowlerCareerTimeoutRef = useRef<number | null>(null);
    const partnershipTimeoutRef = useRef<number | null>(null);
    const thisOverTimeoutRef = useRef<number | null>(null);
    const overByOverTimeoutRef = useRef<number | null>(null);
    const wormTimeoutRef = useRef<number | null>(null);
    const eventTimeoutRef = useRef<number | null>(null);
    const versusTimeoutRef = useRef<number | null>(null);
    const inningsBreakTimeoutRef = useRef<number | null>(null);
    const drinksBreakTimeoutRef = useRef<number | null>(null);
    const scorebarRequestInFlightRef = useRef(false);
    const lastOverlayEventNonceRef = useRef<string | null>(null);

    const fallbackPartnershipData = () => ({
        title: livestream?.title || 'Match Partnership',
        teamName:
            scorebarData?.battingTeam ||
            scorebarData?.teamName ||
            livestream?.team_one_title,
        score: scorebarData?.score || '0-0',
        overs: scorebarData?.overs || '0.0',
        runs: 0,
        balls: 0,
        runRate: '0.00',
        players: scorebarData?.batters || [],
        recent: scorebarData?.recent || [],
    });

    const fallbackWormData = () => ({
        title: livestream?.title || 'Match Worm',
        innings: [
            {
                teamName: livestream?.team_one_title || 'Team One',
                score: '0-0',
                overs: '0.0',
                points: [{ over: 0, runs: 0, wickets: 0 }],
            },
            {
                teamName: livestream?.team_two_title || 'Team Two',
                score: '0-0',
                overs: '0.0',
                points: [{ over: 0, runs: 0, wickets: 0 }],
            },
        ],
    });

    const scheduleOverlayHide = (
        timeoutRef: MutableRefObject<number | null>,
    ) => {
        timeoutRef.current = window.setTimeout(() => {
            setShowPartnership(false);
            setShowOverByOver(false);
            setShowWorm(false);
        }, OVERLAY_AUTO_HIDE_MS);
    };

    const clearOverlayTimeouts = () => {
        [
            squadTimeoutRef,
            batsmanStatsTimeoutRef,
            runnerStatsTimeoutRef,
            batsmanCareerTimeoutRef,
            runnerCareerTimeoutRef,
            bowlerCareerTimeoutRef,
            partnershipTimeoutRef,
            thisOverTimeoutRef,
            overByOverTimeoutRef,
            wormTimeoutRef,
            eventTimeoutRef,
            versusTimeoutRef,
            inningsBreakTimeoutRef,
            drinksBreakTimeoutRef,
        ].forEach((timeoutRef) => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        });
    };

    const hideActiveOverlays = () => {
        clearOverlayTimeouts();
        setEventType(null);
        setShowSquad(false);
        setShowVersus(false);
        setShowInningsBreak(false);
        setShowDrinksBreak(false);
        setShowBatsmanStats(false);
        setShowRunnerStats(false);
        setShowBatsmanCareer(false);
        setShowRunnerCareer(false);
        setShowBowlerCareer(false);
        setShowPartnership(false);
        setShowThisOver(false);
        setShowOverByOver(false);
        setShowWorm(false);
    };

    const fetchSquadData = async (team: 'one' | 'two') => {
        try {
            const response = await fetch(
                `/live/${livestream.live_stream_id}/squad/${team}`,
            );

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.log(error);

            return null;
        }
    };

    const openSquad = async (team: 'one' | 'two') => {
        const requestId = squadRequestRef.current + 1;
        squadRequestRef.current = requestId;

        hideActiveOverlays();
        setSquadData(null);

        const nextSquadData = await fetchSquadData(team);

        if (!nextSquadData || squadRequestRef.current !== requestId) {
            return;
        }

        setSquadData(nextSquadData);
        setShowSquad(true);

        squadTimeoutRef.current = window.setTimeout(() => {
            setShowSquad(false);
        }, OVERLAY_AUTO_HIDE_MS);
    };

    const fetchCurrentBatterCareer = async () => {
        try {
            const response = await fetch(
                `/live/${livestream.live_stream_id}/current-batter-career`,
                {
                    cache: 'no-store',
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const fetchCurrentRunnerCareer = async () => {
        try {
            const response = await fetch(
                `/live/${livestream.live_stream_id}/current-runner-career`,
                {
                    cache: 'no-store',
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const fetchCurrentBowlerCareer = async () => {
        try {
            const response = await fetch(
                `/live/${livestream.live_stream_id}/current-bowler-career`,
                {
                    cache: 'no-store',
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const fetchCurrentBatterStats = async () => {
        try {
            const response = await fetch(
                `/live/${livestream.live_stream_id}/current-batter-stats`,
                {
                    cache: 'no-store',
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const fetchCurrentRunnerStats = async () => {
        try {
            const response = await fetch(
                `/live/${livestream.live_stream_id}/current-runner-stats`,
                {
                    cache: 'no-store',
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const fetchWormData = async () => {
        try {
            const response = await fetch(
                `/live/${livestream.live_stream_id}/worm-data`,
                {
                    cache: 'no-store',
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const fetchPartnershipData = async () => {
        try {
            const response = await fetch(
                `/live/${livestream.live_stream_id}/partnership-data`,
                {
                    cache: 'no-store',
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const fetchThisOverData = async () => {
        try {
            const response = await fetch(
                `/live/${livestream.live_stream_id}/this-over-data`,
                {
                    cache: 'no-store',
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const openBatsmanStats = async () => {
        hideActiveOverlays();
        setBatsmanStatsData(null);

        const nextStatsData = await fetchCurrentBatterStats();

        if (!nextStatsData) {
            return;
        }

        setBatsmanStatsData(nextStatsData);
        setShowBatsmanStats(true);

        batsmanStatsTimeoutRef.current = window.setTimeout(() => {
            setShowBatsmanStats(false);
        }, OVERLAY_AUTO_HIDE_MS);
    };

    const openRunnerStats = async () => {
        hideActiveOverlays();
        setRunnerStatsData(null);

        const nextStatsData = await fetchCurrentRunnerStats();

        if (!nextStatsData) {
            return;
        }

        setRunnerStatsData(nextStatsData);
        setShowRunnerStats(true);

        runnerStatsTimeoutRef.current = window.setTimeout(() => {
            setShowRunnerStats(false);
        }, OVERLAY_AUTO_HIDE_MS);
    };

    const openBatsmanCareer = async () => {
        hideActiveOverlays();
        setBatsmanCareerData(null);

        const nextCareerData = await fetchCurrentBatterCareer();

        if (!nextCareerData) {
            return;
        }

        setBatsmanCareerData(nextCareerData);
        setShowBatsmanCareer(true);

        batsmanCareerTimeoutRef.current = window.setTimeout(() => {
            setShowBatsmanCareer(false);
        }, OVERLAY_AUTO_HIDE_MS);
    };

    const openRunnerCareer = async () => {
        hideActiveOverlays();
        setRunnerCareerData(null);

        const nextCareerData = await fetchCurrentRunnerCareer();

        if (!nextCareerData) {
            return;
        }

        setRunnerCareerData(nextCareerData);
        setShowRunnerCareer(true);

        runnerCareerTimeoutRef.current = window.setTimeout(() => {
            setShowRunnerCareer(false);
        }, OVERLAY_AUTO_HIDE_MS);
    };

    const openBowlerCareer = async () => {
        hideActiveOverlays();
        setBowlerCareerData(null);

        const nextCareerData = await fetchCurrentBowlerCareer();

        if (!nextCareerData) {
            return;
        }

        setBowlerCareerData(nextCareerData);
        setShowBowlerCareer(true);

        bowlerCareerTimeoutRef.current = window.setTimeout(() => {
            setShowBowlerCareer(false);
        }, OVERLAY_AUTO_HIDE_MS);
    };

    const openPartnership = async () => {
        hideActiveOverlays();
        setPartnershipData(fallbackPartnershipData());
        setShowPartnership(true);

        const nextPartnershipData = await fetchPartnershipData();

        if (nextPartnershipData) {
            setPartnershipData(nextPartnershipData);
        } else {
            console.warn(
                'Partnership data unavailable; showing fallback overlay.',
            );
        }

        scheduleOverlayHide(partnershipTimeoutRef);
    };

    const openThisOver = async () => {
        hideActiveOverlays();
        setThisOverData(null);

        const nextThisOverData = await fetchThisOverData();

        if (!nextThisOverData) {
            return;
        }

        setThisOverData(nextThisOverData);
        setShowThisOver(true);

        thisOverTimeoutRef.current = window.setTimeout(() => {
            setShowThisOver(false);
        }, OVERLAY_AUTO_HIDE_MS);
    };

    const openWorm = async () => {
        hideActiveOverlays();
        setWormData(fallbackWormData());
        setShowWorm(true);

        const nextWormData = await fetchWormData();

        if (nextWormData) {
            setWormData(nextWormData);
        } else {
            console.warn('Worm data unavailable; showing fallback overlay.');
        }

        scheduleOverlayHide(wormTimeoutRef);
    };

    const openOverByOver = async () => {
        hideActiveOverlays();
        setWormData(fallbackWormData());
        setShowOverByOver(true);

        const nextWormData = await fetchWormData();

        if (nextWormData) {
            setWormData(nextWormData);
        } else {
            console.warn(
                'Over by over data unavailable; showing fallback overlay.',
            );
        }

        scheduleOverlayHide(overByOverTimeoutRef);
    };

    const handleScoreboardEvent = (e: any, source = 'websocket') => {
        if (!e?.type) {
            return;
        }

        if (e.nonce && lastOverlayEventNonceRef.current === e.nonce) {
            return;
        }

        if (e.nonce) {
            lastOverlayEventNonceRef.current = e.nonce;
        }

        console.info(`ScoreboardUpdated received via ${source}`, e.type);
        setData(e.livestream);

        if (e.type === 'FOUR' || e.type === 'SIX' || e.type === 'WICKET') {
            hideActiveOverlays();
            setEventType(e.type);

            eventTimeoutRef.current = window.setTimeout(
                () => setEventType(null),
                OVERLAY_AUTO_HIDE_MS,
            );
        }

        if (e.type === 'SQUAD_ONE_LIST') {
            openSquad('one');
        }

        if (e.type === 'SQUAD_TWO_LIST') {
            openSquad('two');
        }

        if (e.type === 'MATCH_INTRO') {
            hideActiveOverlays();
            setShowVersus(true);
            versusTimeoutRef.current = window.setTimeout(
                () => setShowVersus(false),
                OVERLAY_AUTO_HIDE_MS,
            );
        }

        if (e.type === 'INNINGS_BREAK') {
            hideActiveOverlays();
            setShowInningsBreak(true);
            inningsBreakTimeoutRef.current = window.setTimeout(
                () => setShowInningsBreak(false),
                OVERLAY_AUTO_HIDE_MS,
            );
        }

        if (e.type === 'DRINKS_BREAK') {
            hideActiveOverlays();
            setShowDrinksBreak(true);
            drinksBreakTimeoutRef.current = window.setTimeout(
                () => setShowDrinksBreak(false),
                OVERLAY_AUTO_HIDE_MS,
            );
        }

        if (e.type === 'BATSMAN_STATS') {
            openBatsmanStats();
        }

        if (e.type === 'RUNNER_STATS') {
            openRunnerStats();
        }

        if (e.type === 'BATSMAN_CAREER') {
            openBatsmanCareer();
        }

        if (e.type === 'RUNNER_CAREER') {
            openRunnerCareer();
        }

        if (e.type === 'BOWLER_CAREER') {
            openBowlerCareer();
        }

        if (e.type === 'PARTNERSHIP') {
            openPartnership();
        }

        if (e.type === 'THIS_OVER') {
            openThisOver();
        }

        if (e.type === 'WORM') {
            openWorm();
        }

        if (e.type === 'OVER_BY_OVER') {
            openOverByOver();
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchScorebarData = async () => {
            if (scorebarRequestInFlightRef.current) {
                return;
            }

            scorebarRequestInFlightRef.current = true;

            try {
                const response = await fetch(
                    `/live/${livestream.live_stream_id}/scorebar-data`,
                    {
                        cache: 'no-store',
                        headers: {
                            Accept: 'application/json',
                        },
                    },
                );

                if (!response.ok) {
                    return;
                }

                const nextScorebarData = await response.json();

                if (isMounted) {
                    setScorebarData(nextScorebarData);
                }
            } catch (error) {
                console.log(error);
            } finally {
                scorebarRequestInFlightRef.current = false;
            }
        };

        fetchScorebarData();
        const interval = window.setInterval(
            fetchScorebarData,
            SCOREBAR_REFRESH_MS,
        );

        return () => {
            isMounted = false;
            window.clearInterval(interval);
        };
    }, [livestream.live_stream_id]);

    useEffect(() => {
        let isMounted = true;

        const fetchOverlayEvent = async () => {
            try {
                const response = await fetch(
                    `/live/${livestream.live_stream_id}/overlay-event`,
                    {
                        cache: 'no-store',
                        headers: {
                            Accept: 'application/json',
                        },
                    },
                );

                if (!response.ok) {
                    return;
                }

                const overlayEvent = await response.json();

                if (isMounted && overlayEvent?.type) {
                    handleScoreboardEvent(overlayEvent, 'polling');
                }
            } catch (error) {
                console.log(error);
            }
        };

        const interval = window.setInterval(
            fetchOverlayEvent,
            OVERLAY_EVENT_POLL_MS,
        );

        return () => {
            isMounted = false;
            window.clearInterval(interval);
        };
    }, [livestream.live_stream_id]);

    useEffect(() => {
        const channel = echo.channel(`livestream.${livestream.id}`);

        channel.listen('.ScoreboardUpdated', (e: any) => {
            handleScoreboardEvent(e);
        });

        return () => {
            echo.leave(`livestream.${livestream.id}`);
            clearOverlayTimeouts();
        };
    }, []);

    return (
        <div>
            {/* Overlay */}
            <Overlay type={eventType} />

            <SquadOverlay
                show={showSquad}
                onClose={() => setShowSquad(false)}
                teamName={squadData?.teamName}
                logo={squadData?.logo}
                score={squadData?.score}
                overs={squadData?.overs}
                extras={squadData?.extras}
                players={squadData?.players}
            />

            <VersusOverlay
                show={showVersus}
                onClose={() => setShowVersus(false)}
                teamOneName={livestream?.team_one_title}
                teamTwoName={livestream?.team_two_title}
                teamOneLogo={`/storage/${livestream?.team_one_logo}`}
                teamTwoLogo={`/storage/${livestream?.team_two_logo}`}
                tournamentName={livestream?.tournament_name}
            />

            <InningsBreakOverlay
                show={showInningsBreak}
                tournamentName={livestream?.tournament_name}
                onClose={() => setShowInningsBreak(false)}
            />

            <DrinksBreakOverlay
                show={showDrinksBreak}
                tournamentName={livestream?.tournament_name}
                onClose={() => setShowDrinksBreak(false)}
            />

            <BatsmanStatsOverlay
                show={showBatsmanStats}
                batsmanName={batsmanStatsData?.name}
                runs={batsmanStatsData?.runs}
                balls={batsmanStatsData?.balls}
                fours={batsmanStatsData?.fours}
                sixes={batsmanStatsData?.sixes}
                strikeRate={batsmanStatsData?.strikeRate}
                batsmanImage={batsmanStatsData?.image}
                teamColor={livestream?.team_one_primary_color}
                onClose={() => setShowBatsmanStats(false)}
            />

            <BatsmanStatsOverlay
                show={showRunnerStats}
                batsmanName={runnerStatsData?.name}
                runs={runnerStatsData?.runs}
                balls={runnerStatsData?.balls}
                fours={runnerStatsData?.fours}
                sixes={runnerStatsData?.sixes}
                strikeRate={runnerStatsData?.strikeRate}
                batsmanImage={runnerStatsData?.image}
                teamColor={livestream?.team_one_primary_color}
                onClose={() => setShowRunnerStats(false)}
            />

            <BatsmanCareerOverlay
                show={showBatsmanCareer}
                data={batsmanCareerData}
                title="Batsman Career"
                teamColor={livestream?.team_one_primary_color}
                onClose={() => setShowBatsmanCareer(false)}
            />

            <BatsmanCareerOverlay
                show={showRunnerCareer}
                data={runnerCareerData}
                title="Runner Career"
                teamColor={livestream?.team_one_primary_color}
                onClose={() => setShowRunnerCareer(false)}
            />

            <BatsmanCareerOverlay
                show={showBowlerCareer}
                data={bowlerCareerData}
                title="Bowler Career"
                teamColor={livestream?.team_two_primary_color}
                onClose={() => setShowBowlerCareer(false)}
            />

            <PartnershipOverlay
                show={showPartnership}
                data={partnershipData}
                teamColor={livestream?.team_one_primary_color}
                onClose={() => setShowPartnership(false)}
            />

            <ThisOverOverlay
                show={showThisOver}
                data={thisOverData}
                teamColor={livestream?.team_one_primary_color}
                onClose={() => setShowThisOver(false)}
            />

            <WormOverlay
                show={showWorm}
                data={wormData}
                onClose={() => setShowWorm(false)}
            />

            <OverByOverWormOverlay
                show={showOverByOver}
                data={wormData}
                onClose={() => setShowOverByOver(false)}
            />

            {/* Scoreboard */}
            <Scorebar data={scorebarData ?? data} />
        </div>
    );
}
