<?php

namespace App\Http\Controllers;

use App\Events\ScoreboardUpdated;
use App\Models\Livestream;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Pool;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class LivestreamController extends Controller
{
    public function store(Request $request)
    {
        try {
            // ✅ Validation
            $request->validate([
                'teamOneName' => 'required|string|max:255',
                'teamTwoName' => 'required|string|max:255',
                'teamOneID' => 'required|numeric',
                'teamTwoID' => 'required|numeric',
                'teamOneLogo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'teamTwoLogo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            // ✅ Upload Images
            $teamOneLogo = null;
            if ($request->hasFile('teamOneLogo')) {
                $teamOneLogo = $request->file('teamOneLogo')->store('livestream', 'public');
            }

            $teamTwoLogo = null;
            if ($request->hasFile('teamTwoLogo')) {
                $teamTwoLogo = $request->file('teamTwoLogo')->store('livestream', 'public');
            }

            // ✅ Save Data
            $livestream = Livestream::create([
                'title' => $request->teamOneName.' vs '.$request->teamTwoName,

                'live_stream_id' => uniqid(),
                'live_stream_url' => '',

                'primary_color' => $request->UIColorPrimary,
                'secondary_color' => $request->UIColorSecondary,

                'match_id' => $request->matchId,
                'club_id' => $request->clubId,
                'match_type' => $request->MatchType,

                // Team One
                'team_one_title' => $request->teamOneName,
                'team_one_id' => $request->teamOneID,
                'team_one_logo' => $teamOneLogo,
                'team_one_primary_color' => $request->teamOneColorPrimary,
                'team_one_secondary_color' => $request->teamOneColorSecondary,

                // Team Two
                'team_two_title' => $request->teamTwoName,
                'team_two_id' => $request->teamTwoID,
                'team_two_logo' => $teamTwoLogo,
                'team_two_primary_color' => $request->teamTwoColorPrimary,
                'team_two_secondary_color' => $request->teamTwoColorSecondary,

                'match_status' => 'upcoming',
            ]);

            $this->cacheSquadsFromScorecard($livestream);

            return response()->json([
                'status' => true,
                'message' => 'Livestream created successfully',
                'data' => $livestream->live_stream_id,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        return inertia('livescore', [
            'livestream' => $livestream,
        ]);
    }

    public function live($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        return inertia('live', [
            'livestream' => $livestream,
        ]);
    }

    public function overlayEvent($streamID)
    {
        Livestream::where('live_stream_id', $streamID)->firstOrFail();

        return response()->json(
            Cache::get($this->overlayEventCacheKey($streamID), [])
        );
    }

    public function scorebarData($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        if (! $livestream->match_id || ! $livestream->club_id) {
            return response()->json([
                'message' => 'Match ID and Club ID are required for scorebar data.',
            ], 422);
        }

        $headers = [
            'x-consumer-key' => config('services.cricclubs.consumer_key'),
            'x-api-key' => config('services.cricclubs.api_key'),
            'Accept' => 'application/json',
        ];

        $query = [
            'matchId' => $livestream->match_id,
            'clubId' => $livestream->club_id,
        ];

        try {
            [$response, $scorecardResponse] = Http::pool(fn (Pool $pool) => [
                $pool->withHeaders($headers)->get(config('services.cricclubs.base_url').'/scoreCard/getBallByBall', $query),
                $pool->withHeaders($headers)->get(config('services.cricclubs.base_url').'/scoreCard/getScoreCard', $query),
            ]);
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => 'Unable to connect to CricClubs.',
            ], 502);
        }

        if (! $response->successful()) {
            return response()->json([
                'message' => 'CricClubs scorebar request failed.',
            ], 502);
        }

        $payload = $response->json();

        if (! Arr::get($payload, 'responseState')) {
            return response()->json([
                'message' => Arr::get($payload, 'errorMessage', 'CricClubs returned an invalid response.'),
            ], 502);
        }

        $scorecardData = [];

        if ($scorecardResponse->successful() && Arr::get($scorecardResponse->json(), 'responseState')) {
            $scorecardData = Arr::get($scorecardResponse->json(), 'data', []);
        }

        return response()->json($this->normalizeScorebarData($livestream, Arr::get($payload, 'data', []), $scorecardData));
    }

    public function squadData($streamID, $team)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();
        $isTeamTwo = $team === 'two';
        $teamId = $isTeamTwo ? $livestream->team_two_id : $livestream->team_one_id;
        $teamName = $isTeamTwo ? $livestream->team_two_title : $livestream->team_one_title;
        $teamLogo = $isTeamTwo ? $livestream->team_two_logo : $livestream->team_one_logo;
        $cachedSquad = $isTeamTwo ? $livestream->team_two_squad : $livestream->team_one_squad;

        if (is_array($cachedSquad) && $cachedSquad !== []) {
            return response()->json($cachedSquad);
        }

        if (! $livestream->match_id || ! $livestream->club_id) {
            return response()->json([
                'message' => 'Match ID and Club ID are required for squad data.',
            ], 422);
        }

        try {
            $response = Http::withHeaders([
                'x-consumer-key' => config('services.cricclubs.consumer_key'),
                'x-api-key' => config('services.cricclubs.api_key'),
                'Accept' => 'application/json',
            ])->get(config('services.cricclubs.base_url').'/scoreCard/getScoreCard', [
                'matchId' => $livestream->match_id,
                'clubId' => $livestream->club_id,
            ]);
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => 'Unable to connect to CricClubs.',
            ], 502);
        }

        if (! $response->successful()) {
            return response()->json([
                'message' => 'CricClubs squad request failed.',
            ], 502);
        }

        $payload = $response->json();

        if (! Arr::get($payload, 'responseState')) {
            return response()->json([
                'message' => Arr::get($payload, 'errorMessage', 'CricClubs returned an invalid squad response.'),
            ], 502);
        }

        $data = Arr::get($payload, 'data', []);
        $squad = $this->buildSquadPayload($data, $teamId, $teamName, $teamLogo, $isTeamTwo);

        $livestream->forceFill([
            $isTeamTwo ? 'team_two_squad' : 'team_one_squad' => $squad,
        ])->save();

        return response()->json($squad);
    }

    public function currentBatterCareer($streamID)
    {
        return $this->currentPlayerCareer($streamID, 'batter');
    }

    public function currentBatterStats($streamID)
    {
        return $this->currentPlayerStats($streamID, 'batter');
    }

    public function currentRunnerStats($streamID)
    {
        return $this->currentPlayerStats($streamID, 'runner');
    }

    private function currentPlayerStats($streamID, string $role)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        if (! $livestream->match_id || ! $livestream->club_id) {
            return response()->json([
                'message' => 'Match ID and Club ID are required for current player stats.',
            ], 422);
        }

        $headers = [
            'x-consumer-key' => config('services.cricclubs.consumer_key'),
            'x-api-key' => config('services.cricclubs.api_key'),
            'Accept' => 'application/json',
        ];

        $query = [
            'matchId' => $livestream->match_id,
            'clubId' => $livestream->club_id,
        ];

        try {
            [$scorebarResponse, $scorecardResponse] = Http::pool(fn (Pool $pool) => [
                $pool->withHeaders($headers)->get(config('services.cricclubs.base_url').'/scoreCard/getBallByBall', $query),
                $pool->withHeaders($headers)->get(config('services.cricclubs.base_url').'/scoreCard/getScoreCard', $query),
            ]);
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => 'Unable to connect to CricClubs.',
            ], 502);
        }

        if (! $scorebarResponse->successful() || ! $scorecardResponse->successful()) {
            return response()->json([
                'message' => 'CricClubs current player stats request failed.',
            ], 502);
        }

        $scorebarPayload = $scorebarResponse->json();
        $scorecardPayload = $scorecardResponse->json();

        if (! Arr::get($scorebarPayload, 'responseState') || ! Arr::get($scorecardPayload, 'responseState')) {
            return response()->json([
                'message' => 'CricClubs returned an invalid current player stats response.',
            ], 502);
        }

        $scorebarData = $this->normalizeScorebarData($livestream, Arr::get($scorebarPayload, 'data', []), Arr::get($scorecardPayload, 'data', []));
        $player = $role === 'runner'
            ? $this->currentRunnerFromScorebar($scorebarData)
            : $this->currentBatterFromScorebar($scorebarData);

        if (! $player || ! Arr::get($player, 'id')) {
            return response()->json([
                'message' => 'Current player was not found.',
            ], 404);
        }

        return response()->json($this->normalizeCurrentBatterStats(
            $player,
            Arr::get($scorecardPayload, 'data', []),
            Arr::get($scorebarData, 'battingLogo')
        ));
    }

    public function currentRunnerCareer($streamID)
    {
        return $this->currentPlayerCareer($streamID, 'runner');
    }

    public function currentBowlerCareer($streamID)
    {
        return $this->currentPlayerCareer($streamID, 'bowler');
    }

    public function wormData($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        if (! $livestream->match_id || ! $livestream->club_id) {
            return response()->json([
                'message' => 'Match ID and Club ID are required for worm data.',
            ], 422);
        }

        try {
            $response = Http::withHeaders([
                'x-consumer-key' => config('services.cricclubs.consumer_key'),
                'x-api-key' => config('services.cricclubs.api_key'),
                'Accept' => 'application/json',
            ])->get(config('services.cricclubs.base_url').'/scoreCard/getBallByBall', [
                'matchId' => $livestream->match_id,
                'clubId' => $livestream->club_id,
            ]);
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => 'Unable to connect to CricClubs.',
            ], 502);
        }

        if (! $response->successful()) {
            return response()->json([
                'message' => 'CricClubs worm request failed.',
            ], 502);
        }

        $payload = $response->json();

        if (! Arr::get($payload, 'responseState')) {
            return response()->json([
                'message' => Arr::get($payload, 'errorMessage', 'CricClubs returned an invalid worm response.'),
            ], 502);
        }

        return response()->json($this->normalizeWormData($livestream, Arr::get($payload, 'data', [])));
    }

    public function partnershipData($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        if (! $livestream->match_id || ! $livestream->club_id) {
            return response()->json([
                'message' => 'Match ID and Club ID are required for partnership data.',
            ], 422);
        }

        try {
            $response = Http::withHeaders([
                'x-consumer-key' => config('services.cricclubs.consumer_key'),
                'x-api-key' => config('services.cricclubs.api_key'),
                'Accept' => 'application/json',
            ])->get(config('services.cricclubs.base_url').'/scoreCard/getBallByBall', [
                'matchId' => $livestream->match_id,
                'clubId' => $livestream->club_id,
            ]);
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => 'Unable to connect to CricClubs.',
            ], 502);
        }

        if (! $response->successful()) {
            return response()->json([
                'message' => 'CricClubs partnership request failed.',
            ], 502);
        }

        $payload = $response->json();

        if (! Arr::get($payload, 'responseState')) {
            return response()->json([
                'message' => Arr::get($payload, 'errorMessage', 'CricClubs returned an invalid partnership response.'),
            ], 502);
        }

        return response()->json($this->normalizePartnershipData($livestream, Arr::get($payload, 'data', [])));
    }

    public function thisOverData($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        if (! $livestream->match_id || ! $livestream->club_id) {
            return response()->json([
                'message' => 'Match ID and Club ID are required for this over data.',
            ], 422);
        }

        try {
            $response = Http::withHeaders([
                'x-consumer-key' => config('services.cricclubs.consumer_key'),
                'x-api-key' => config('services.cricclubs.api_key'),
                'Accept' => 'application/json',
            ])->get(config('services.cricclubs.base_url').'/scoreCard/getBallByBall', [
                'matchId' => $livestream->match_id,
                'clubId' => $livestream->club_id,
            ]);
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => 'Unable to connect to CricClubs.',
            ], 502);
        }

        if (! $response->successful()) {
            return response()->json([
                'message' => 'CricClubs this over request failed.',
            ], 502);
        }

        $payload = $response->json();

        if (! Arr::get($payload, 'responseState')) {
            return response()->json([
                'message' => Arr::get($payload, 'errorMessage', 'CricClubs returned an invalid this over response.'),
            ], 502);
        }

        return response()->json($this->normalizeThisOverData($livestream, Arr::get($payload, 'data', [])));
    }

    private function currentPlayerCareer($streamID, string $role)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        if (! $livestream->match_id || ! $livestream->club_id) {
            return response()->json([
                'message' => 'Match ID and Club ID are required for current player career data.',
            ], 422);
        }

        try {
            $scorebarResponse = Http::withHeaders([
                'x-consumer-key' => config('services.cricclubs.consumer_key'),
                'x-api-key' => config('services.cricclubs.api_key'),
                'Accept' => 'application/json',
            ])->get(config('services.cricclubs.base_url').'/scoreCard/getBallByBall', [
                'matchId' => $livestream->match_id,
                'clubId' => $livestream->club_id,
            ]);
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => 'Unable to connect to CricClubs.',
            ], 502);
        }

        if (! $scorebarResponse->successful()) {
            return response()->json([
                'message' => 'CricClubs scorebar request failed.',
            ], 502);
        }

        $scorebarPayload = $scorebarResponse->json();

        if (! Arr::get($scorebarPayload, 'responseState')) {
            return response()->json([
                'message' => Arr::get($scorebarPayload, 'errorMessage', 'CricClubs returned an invalid scorebar response.'),
            ], 502);
        }

        $scorebarData = $this->normalizeScorebarData($livestream, Arr::get($scorebarPayload, 'data', []));
        $player = match ($role) {
            'runner' => $this->currentRunnerFromScorebar($scorebarData),
            'bowler' => $this->currentBowlerFromScorebar($scorebarData),
            default => $this->currentBatterFromScorebar($scorebarData),
        };

        if (! $player || ! Arr::get($player, 'id')) {
            return response()->json([
                'message' => 'Current player was not found.',
            ], 404);
        }

        try {
            $statsResponse = Http::withHeaders([
                'x-consumer-key' => config('services.cricclubs.consumer_key'),
                'x-api-key' => config('services.cricclubs.api_key'),
                'Accept' => 'application/json',
                'User-Agent' => 'Mozilla/5.0',
            ])->get(config('services.cricclubs.base_url').'/player/getStats', [
                'v' => '5.0.29',
                'X-Auth-Token' => config('services.cricclubs.auth_token'),
                'playerId' => Arr::get($player, 'id'),
                'association' => config('services.cricclubs.association'),
            ]);
        } catch (ConnectionException $exception) {
            return response()->json([
                'message' => 'Unable to connect to CricClubs player stats.',
            ], 502);
        }

        if (! $statsResponse->successful()) {
            return response()->json([
                'message' => 'CricClubs player stats request failed.',
            ], 502);
        }

        $statsPayload = $statsResponse->json();

        if (! Arr::get($statsPayload, 'responseState')) {
            return response()->json([
                'message' => Arr::get($statsPayload, 'errorMessage', 'CricClubs returned an invalid player stats response.'),
            ], 502);
        }

        $statsData = Arr::get($statsPayload, 'data', []);

        return response()->json(
            $role === 'bowler'
                ? $this->normalizeBowlerCareerData($player, $statsData)
                : $this->normalizeBatterCareerData($player, $statsData)
        );
    }

    private function normalizeScorebarData(Livestream $livestream, array $data, array $scorecardData = []): array
    {
        $innings = $this->latestInningsBalls($data);
        $teamId = Arr::get($innings, 'teamId');
        $battingTeamName = Arr::get($innings, 'teamName', $livestream->team_one_title);
        $teamOneId = (int) $livestream->team_one_id;
        $teamTwoId = (int) $livestream->team_two_id;
        $isTeamTwoBatting = ((int) $teamId === $teamTwoId)
            || strcasecmp((string) $battingTeamName, (string) $livestream->team_two_title) === 0;

        $battingLogo = $isTeamTwoBatting
            ? $livestream->team_two_logo
            : $livestream->team_one_logo;

        $bowlingLogo = $isTeamTwoBatting
            ? $livestream->team_one_logo
            : $livestream->team_two_logo;

        $batters = array_values(array_filter([
            $this->normalizeBatter(Arr::get($data, 'latestBatting.batsman1')),
            $this->normalizeBatter(Arr::get($data, 'latestBatting.batsman2')),
        ]));

        $latestBall = $this->latestRealBall($innings);
        $strikerId = Arr::get($latestBall, 'striker');

        foreach ($batters as $index => $batter) {
            $batters[$index]['isStriker'] = $strikerId && $batter['id'] === (int) $strikerId;
        }

        $scorecardInnings = $this->scorecardInningsForTeam($scorecardData, $teamId, $battingTeamName);
        $runRate = Arr::get($scorecardInnings, 'runRate') ?: Arr::get($this->latestOver($innings), 'runRate');
        $requiredRunRate = Arr::get($scorecardInnings, 'rrr');

        return [
            'battingTeam' => $battingTeamName,
            'bowlingTeam' => $this->opponentTeamName($livestream, $teamId, $battingTeamName),
            'score' => str_replace('/', '-', Arr::get($innings, 'rcb', '0-0')),
            'overs' => Arr::get($innings, 'overs', '0.0'),
            'runRate' => $runRate,
            'requiredRunRate' => $requiredRunRate,
            'battingLogo' => $battingLogo ? '/storage/'.$battingLogo : null,
            'bowlingLogo' => $bowlingLogo ? '/storage/'.$bowlingLogo : null,
            'batters' => $batters,
            'bowler' => $this->normalizeBowler(Arr::get($data, 'latestBowling.bowler1')),
            'balls' => $this->normalizeBalls($this->latestOver($innings)),
            'ticker' => $livestream->title,
        ];
    }

    private function scorecardInningsForTeam(array $data, $teamId, ?string $teamName): array
    {
        foreach (['innings1', 'innings2', 'innings3', 'innings4'] as $key) {
            $innings = Arr::get($data, $key);

            if (! is_array($innings)) {
                continue;
            }

            if ((int) Arr::get($innings, 'teamId') === (int) $teamId) {
                return $innings;
            }

            if (strcasecmp((string) Arr::get($innings, 'teamName'), (string) $teamName) === 0) {
                return $innings;
            }
        }

        return [];
    }

    private function cacheSquadsFromScorecard(Livestream $livestream): void
    {
        if (! $livestream->match_id || ! $livestream->club_id) {
            return;
        }

        try {
            $response = Http::withHeaders([
                'x-consumer-key' => config('services.cricclubs.consumer_key'),
                'x-api-key' => config('services.cricclubs.api_key'),
                'Accept' => 'application/json',
            ])->get(config('services.cricclubs.base_url').'/scoreCard/getScoreCard', [
                'matchId' => $livestream->match_id,
                'clubId' => $livestream->club_id,
            ]);
        } catch (ConnectionException $exception) {
            return;
        }

        $payload = $response->json();

        if (! $response->successful() || ! Arr::get($payload, 'responseState')) {
            return;
        }

        $data = Arr::get($payload, 'data', []);

        $livestream->forceFill([
            'team_one_squad' => $this->buildSquadPayload(
                $data,
                $livestream->team_one_id,
                $livestream->team_one_title,
                $livestream->team_one_logo,
                false
            ),
            'team_two_squad' => $this->buildSquadPayload(
                $data,
                $livestream->team_two_id,
                $livestream->team_two_title,
                $livestream->team_two_logo,
                true
            ),
        ])->save();
    }

    private function buildSquadPayload(
        array $scorecardData,
        $teamId,
        ?string $teamName,
        ?string $teamLogo,
        bool $isTeamTwo
    ): array {
        $innings = $this->scorecardInningsForTeam($scorecardData, $teamId, $teamName);
        $captainId = Arr::get($scorecardData, $isTeamTwo ? 'matchInfo.team2Captain' : 'matchInfo.team1Captain');
        $wicketKeeperId = Arr::get($scorecardData, $isTeamTwo ? 'matchInfo.team2WicketKeeper' : 'matchInfo.team1WicketKeeper');

        return [
            'teamName' => $teamName,
            'logo' => $teamLogo ? '/storage/'.$teamLogo : null,
            'players' => array_map(
                fn ($player) => $this->normalizeSquadPlayer($player, $captainId, $wicketKeeperId),
                Arr::get($innings, 'batting', [])
            ),
        ];
    }

    private function normalizeSquadPlayer(array $player, $captainId, $wicketKeeperId): array
    {
        $playerId = Arr::get($player, 'playerID');
        $roles = array_values(array_filter([
            (int) $playerId === (int) $captainId ? 'Captain' : null,
            (int) $playerId === (int) $wicketKeeperId ? 'Wicket Keeper' : null,
            Arr::get($player, 'battingStyle'),
        ]));

        return [
            'id' => $playerId,
            'name' => trim(Arr::get($player, 'firstName', '').' '.Arr::get($player, 'lastName', '')),
            'role' => $roles ? implode(' / ', $roles) : 'Player',
            'status' => Arr::get($player, 'outStringNoLink') ?: (Arr::get($player, 'isOut') === '1' ? 'out' : 'not out'),
            'runs' => Arr::get($player, 'runsScored', ''),
            'balls' => Arr::get($player, 'ballsFaced', ''),
            'fours' => Arr::get($player, 'fours', ''),
            'sixes' => Arr::get($player, 'sixers', ''),
            'strikeRate' => Arr::get($player, 'strikeRate', ''),
            'image' => Arr::get($player, 'profilepic_file_path'),
        ];
    }

    private function currentBatterFromScorebar(array $scorebarData): ?array
    {
        $batters = Arr::get($scorebarData, 'batters', []);

        foreach ($batters as $batter) {
            if (Arr::get($batter, 'isStriker')) {
                return $batter;
            }
        }

        return Arr::first($batters);
    }

    private function currentRunnerFromScorebar(array $scorebarData): ?array
    {
        $batters = Arr::get($scorebarData, 'batters', []);
        $hasStriker = false;

        foreach ($batters as $batter) {
            if (Arr::get($batter, 'isStriker')) {
                $hasStriker = true;
                break;
            }
        }

        if ($hasStriker) {
            foreach ($batters as $batter) {
                if (! Arr::get($batter, 'isStriker')) {
                    return $batter;
                }
            }
        }

        return Arr::get($batters, 1) ?: Arr::first($batters);
    }

    private function currentBowlerFromScorebar(array $scorebarData): ?array
    {
        return Arr::get($scorebarData, 'bowler');
    }

    private function normalizeWormData(Livestream $livestream, array $data): array
    {
        $innings = [];

        foreach (['innings1Balls', 'innings2Balls', 'innings3Balls', 'innings4Balls'] as $index => $key) {
            $inningsData = Arr::get($data, $key);

            if (! is_array($inningsData)) {
                continue;
            }

            $points = $this->wormPointsForInnings($inningsData);

            if ($points === []) {
                continue;
            }

            $teamName = Arr::get($inningsData, 'teamName')
                ?: ($index === 0 ? $livestream->team_one_title : $livestream->team_two_title);

            $innings[] = [
                'teamName' => $teamName,
                'score' => str_replace('/', '-', Arr::get($inningsData, 'rcb', '0-0')),
                'overs' => Arr::get($inningsData, 'overs', '0.0'),
                'points' => $points,
            ];
        }

        return [
            'title' => $livestream->title,
            'innings' => $innings,
        ];
    }

    private function normalizePartnershipData(Livestream $livestream, array $data): array
    {
        $innings = $this->latestInningsBalls($data);
        $scorebarData = $this->normalizeScorebarData($livestream, $data);
        $batters = Arr::get($scorebarData, 'batters', []);
        $balls = $this->flattenInningsBalls($innings);
        $lastWicketIndex = -1;

        foreach ($balls as $index => $ball) {
            if ($this->isWicketBall($ball)) {
                $lastWicketIndex = $index;
            }
        }

        $partnershipBalls = array_slice($balls, $lastWicketIndex + 1);
        $runs = 0;
        $legalBalls = 0;
        $batterRuns = [];
        $batterBalls = [];
        $recent = [];

        foreach ($partnershipBalls as $ball) {
            $runs += (int) Arr::get($ball, 'runs', 0);

            if ($this->isLegalDelivery($ball)) {
                $legalBalls++;
                $striker = (int) Arr::get($ball, 'striker');

                if ($striker) {
                    $batterBalls[$striker] = ($batterBalls[$striker] ?? 0) + 1;
                }
            }

            $batRuns = $this->batterRunsFromBall($ball);
            $striker = (int) Arr::get($ball, 'striker');

            if ($striker && $batRuns > 0) {
                $batterRuns[$striker] = ($batterRuns[$striker] ?? 0) + $batRuns;
            }

            $recent[] = [
                'value' => Arr::get($ball, 'runsDisplay', '.'),
                'type' => Arr::get($ball, 'ballType'),
            ];
        }

        $players = array_map(function ($batter) use ($batterRuns, $batterBalls) {
            $id = (int) Arr::get($batter, 'id');

            return [
                'id' => $id,
                'name' => Arr::get($batter, 'name', 'Batter'),
                'runs' => $batterRuns[$id] ?? 0,
                'balls' => $batterBalls[$id] ?? 0,
                'isStriker' => (bool) Arr::get($batter, 'isStriker'),
            ];
        }, $batters);

        return [
            'title' => $livestream->title,
            'teamName' => Arr::get($scorebarData, 'battingTeam'),
            'score' => Arr::get($scorebarData, 'score'),
            'overs' => Arr::get($scorebarData, 'overs'),
            'runs' => $runs,
            'balls' => $legalBalls,
            'runRate' => $legalBalls > 0 ? number_format(($runs / $legalBalls) * 6, 2, '.', '') : '0.00',
            'players' => $players,
            'recent' => array_slice($recent, -12),
        ];
    }

    private function normalizeThisOverData(Livestream $livestream, array $data): array
    {
        $innings = $this->latestInningsBalls($data);
        $scorebarData = $this->normalizeScorebarData($livestream, $data);
        $over = $this->latestOver($innings);
        $balls = $this->normalizeBalls($over);
        $legalBalls = count(array_filter($balls, fn ($ball) => $this->isLegalDelivery([
            'ballType' => Arr::get($ball, 'type'),
            'runsDisplay' => Arr::get($ball, 'value'),
        ])));

        return [
            'title' => $livestream->title,
            'teamName' => Arr::get($scorebarData, 'battingTeam'),
            'score' => Arr::get($scorebarData, 'score'),
            'overs' => Arr::get($scorebarData, 'overs'),
            'overNumber' => (int) Arr::get($over, 'overNum', 0) + 1,
            'runs' => Arr::get($over, 'runs', 0),
            'legalBalls' => $legalBalls,
            'balls' => $balls,
            'bowler' => [
                'name' => Arr::get($over, 'bowlerName', Arr::get($scorebarData, 'bowler.name', 'Bowler')),
                'runs' => Arr::get($over, 'bowlerRuns', 0),
                'wickets' => Arr::get($over, 'bowlerWickets', 0),
                'balls' => Arr::get($over, 'bowlerBalls', 0),
            ],
            'batters' => [
                [
                    'name' => Arr::get($over, 'batsmanName', Arr::get($scorebarData, 'batters.0.name', 'Batter')),
                    'runs' => Arr::get($over, 'batsmanRuns', 0),
                    'balls' => Arr::get($over, 'batsmanBalls', 0),
                ],
                [
                    'name' => Arr::get($over, 'runnerName', Arr::get($scorebarData, 'batters.1.name', 'Runner')),
                    'runs' => Arr::get($over, 'runnerRuns', 0),
                    'balls' => Arr::get($over, 'runnerBalls', 0),
                ],
            ],
        ];
    }

    private function flattenInningsBalls(array $innings): array
    {
        $oversMap = Arr::get($innings, 'oversMap', []);

        if (! is_array($oversMap)) {
            return [];
        }

        $balls = [];

        foreach ($oversMap as $over) {
            foreach (Arr::get($over, 'balls', []) as $ball) {
                if (Arr::get($ball, 'ball') === 0 || Arr::get($ball, 'ballType') === 'Auto Comment Ball') {
                    continue;
                }

                $balls[] = $ball;
            }
        }

        usort($balls, function ($a, $b) {
            return [(int) Arr::get($a, 'over', 0), (int) Arr::get($a, 'ball', 0)]
                <=> [(int) Arr::get($b, 'over', 0), (int) Arr::get($b, 'ball', 0)];
        });

        return $balls;
    }

    private function isWicketBall(array $ball): bool
    {
        return Arr::get($ball, 'runsDisplay') === 'W'
            || str_contains(strtoupper((string) Arr::get($ball, 'commentary', '')), 'OUT!');
    }

    private function isLegalDelivery(array $ball): bool
    {
        $type = strtolower((string) Arr::get($ball, 'ballType', ''));
        $display = strtolower((string) Arr::get($ball, 'runsDisplay', ''));

        return ! str_contains($type, 'wide')
            && ! str_contains($type, 'no ball')
            && ! str_contains($display, 'wd')
            && ! str_contains($display, 'nb');
    }

    private function batterRunsFromBall(array $ball): int
    {
        $display = (string) Arr::get($ball, 'runsDisplay', '');

        return preg_match('/^\d+$/', $display) ? (int) $display : 0;
    }

    private function wormPointsForInnings(array $innings): array
    {
        $oversMap = Arr::get($innings, 'oversMap', []);

        if (! is_array($oversMap) || $oversMap === []) {
            return [];
        }

        $overs = array_values($oversMap);

        usort($overs, fn ($a, $b) => (int) Arr::get($a, 'overNum', 0) <=> (int) Arr::get($b, 'overNum', 0));

        $points = [[
            'over' => 0,
            'runs' => 0,
            'wickets' => 0,
        ]];

        foreach ($overs as $over) {
            [$runs, $wickets] = $this->scoreParts(Arr::get($over, 'rcb', '0/0'));

            $points[] = [
                'over' => (int) Arr::get($over, 'overNum', 0) + 1,
                'runs' => $runs,
                'wickets' => $wickets,
            ];
        }

        return $points;
    }

    private function scoreParts(string $score): array
    {
        $parts = preg_split('/[\/-]/', $score);

        return [
            (int) ($parts[0] ?? 0),
            (int) ($parts[1] ?? 0),
        ];
    }

    private function normalizeCurrentBatterStats(array $currentBatter, array $scorecardData, ?string $teamLogo): array
    {
        $playerId = Arr::get($currentBatter, 'id');
        $player = null;

        foreach (['innings1', 'innings2', 'innings3', 'innings4'] as $key) {
            $batting = Arr::get($scorecardData, $key.'.batting', []);

            if (! is_array($batting)) {
                continue;
            }

            foreach ($batting as $batter) {
                if ((int) Arr::get($batter, 'playerID') === (int) $playerId) {
                    $player = $batter;
                    break 2;
                }
            }
        }

        $player = $player ?: $currentBatter;
        $runs = Arr::get($player, 'runsScored', Arr::get($currentBatter, 'runs', 0));
        $balls = Arr::get($player, 'ballsFaced', Arr::get($currentBatter, 'balls', 0));
        $strikeRate = Arr::get($player, 'strikeRate');

        if ($strikeRate === null) {
            $strikeRate = (int) $balls > 0 ? number_format(((int) $runs / (int) $balls) * 100, 2, '.', '') : '0.00';
        }

        return [
            'playerId' => $playerId,
            'name' => trim(Arr::get($player, 'firstName', '').' '.Arr::get($player, 'lastName', '')) ?: Arr::get($currentBatter, 'name', 'Player'),
            'runs' => $runs,
            'balls' => $balls,
            'fours' => Arr::get($player, 'fours', 0),
            'sixes' => Arr::get($player, 'sixers', 0),
            'strikeRate' => $strikeRate,
            'status' => Arr::get($player, 'outStringNoLink') ?: (Arr::get($player, 'isOut') === '1' ? 'out' : 'not out'),
            'image' => Arr::get($player, 'profilepic_file_path'),
            'teamLogo' => $teamLogo,
        ];
    }

    private function normalizeBatterCareerData(array $currentBatter, array $statsData): array
    {
        $batting = Arr::first(Arr::get($statsData, 'battingStats', []), default: []);
        $bowling = Arr::first(Arr::get($statsData, 'bowlingStats', []), default: []);
        $name = Arr::get($batting, 'fullName')
            ?: trim(Arr::get($batting, 'firstName', Arr::get($currentBatter, 'name', '')).' '.Arr::get($batting, 'lastName', ''));

        return [
            'playerId' => Arr::get($currentBatter, 'id'),
            'name' => trim($name) ?: Arr::get($currentBatter, 'name', 'Player'),
            'role' => Arr::get($batting, 'playingRole') ?: Arr::get($bowling, 'playingRole') ?: 'Player',
            'teamName' => Arr::get($batting, 'teamName') ?: Arr::get($bowling, 'teamName'),
            'image' => Arr::get($batting, 'profilepic_file_path') ?: Arr::get($bowling, 'profilepic_file_path'),
            'batting' => [
                'matches' => Arr::get($batting, 'matches', 0),
                'innings' => Arr::get($batting, 'innings', 0),
                'runs' => Arr::get($batting, 'runsScored', 0),
                'balls' => Arr::get($batting, 'ballsFaced', 0),
                'highestScore' => Arr::get($batting, 'highestScore', 0),
                'average' => Arr::get($batting, 'average', '0.00'),
                'strikeRate' => Arr::get($batting, 'strikeRate', '0.00'),
                'fours' => Arr::get($batting, 'fours', 0),
                'sixes' => Arr::get($batting, 'sixers', 0),
                'fifties' => Arr::get($batting, 'fifties', 0),
                'hundreds' => Arr::get($batting, 'hundreds', 0),
            ],
        ];
    }

    private function normalizeBowlerCareerData(array $currentBowler, array $statsData): array
    {
        $bowling = Arr::first(Arr::get($statsData, 'bowlingStats', []), default: []);
        $batting = Arr::first(Arr::get($statsData, 'battingStats', []), default: []);
        $name = Arr::get($bowling, 'fullName')
            ?: trim(Arr::get($bowling, 'firstName', Arr::get($currentBowler, 'name', '')).' '.Arr::get($bowling, 'lastName', ''));
        if (strcasecmp(trim($name), 'Blank Blank') === 0) {
            $name = Arr::get($currentBowler, 'name', 'Player');
        }

        if (strcasecmp(trim($name), 'Blank Blank') === 0) {
            $name = 'Player';
        }

        return [
            'playerId' => Arr::get($currentBowler, 'id'),
            'name' => trim($name) ?: Arr::get($currentBowler, 'name', 'Player'),
            'role' => Arr::get($bowling, 'playingRole') ?: Arr::get($batting, 'playingRole') ?: 'Bowler',
            'teamName' => Arr::get($bowling, 'teamName') ?: Arr::get($batting, 'teamName'),
            'image' => Arr::get($bowling, 'profilepic_file_path') ?: Arr::get($batting, 'profilepic_file_path'),
            'bowling' => [
                'matches' => Arr::get($bowling, 'matches', 0),
                'innings' => Arr::get($bowling, 'innings', 0),
                'overs' => Arr::get($bowling, 'overs') ?: Arr::get($bowling, 'oversBowled') ?: '0.0',
                'runs' => Arr::get($bowling, 'runs', Arr::get($bowling, 'runsGiven', 0)),
                'wickets' => Arr::get($bowling, 'wickets', 0),
                'best' => Arr::get($bowling, 'bestBowling') ?: Arr::get($bowling, 'bestBowlingInInnings', '0/0'),
                'average' => Arr::get($bowling, 'average', '0.00'),
                'economy' => Arr::get($bowling, 'economy', '0.00'),
                'strikeRate' => Arr::get($bowling, 'strikeRate', '0.00'),
                'maidens' => Arr::get($bowling, 'maidens', 0),
            ],
        ];
    }

    private function latestInningsBalls(array $data): array
    {
        foreach (['innings4Balls', 'innings3Balls', 'innings2Balls', 'innings1Balls'] as $key) {
            $innings = Arr::get($data, $key);

            if (is_array($innings) && count(Arr::get($innings, 'oversMap', [])) > 0) {
                return $innings;
            }
        }

        foreach (['innings4Balls', 'innings3Balls', 'innings2Balls', 'innings1Balls'] as $key) {
            $innings = Arr::get($data, $key);

            if (is_array($innings)) {
                return $innings;
            }
        }

        return [];
    }

    private function latestOver(array $innings): array
    {
        $oversMap = Arr::get($innings, 'oversMap', []);

        if (! is_array($oversMap) || $oversMap === []) {
            return [];
        }

        $overs = array_values($oversMap);

        usort($overs, fn ($a, $b) => (int) Arr::get($a, 'overNum', -1) <=> (int) Arr::get($b, 'overNum', -1));

        return end($overs) ?: [];
    }

    private function latestRealBall(array $innings): ?array
    {
        $balls = $this->normalizeBalls($this->latestOver($innings));

        return $balls ? end($balls) : null;
    }

    private function normalizeBatter(?array $batter): ?array
    {
        if (! $batter) {
            return null;
        }

        return [
            'id' => (int) Arr::get($batter, 'playerID'),
            'name' => trim(Arr::get($batter, 'firstName', '').' '.Arr::get($batter, 'lastName', '')),
            'runs' => Arr::get($batter, 'runsScored', 0),
            'balls' => Arr::get($batter, 'ballsFaced', 0),
            'isOut' => Arr::get($batter, 'isOut') === '1',
            'isStriker' => false,
        ];
    }

    private function normalizeBowler(?array $bowler): ?array
    {
        if (! $bowler) {
            return null;
        }

        return [
            'id' => (int) Arr::get($bowler, 'playerID'),
            'name' => trim(Arr::get($bowler, 'firstName', '').' '.Arr::get($bowler, 'lastName', '')),
            'figures' => Arr::get($bowler, 'wickets', 0).'-'.Arr::get($bowler, 'runs', 0),
            'overs' => Arr::get($bowler, 'overs', '0.0'),
        ];
    }

    private function normalizeBalls(array $over): array
    {
        $balls = array_filter(Arr::get($over, 'balls', []), function ($ball) {
            return Arr::get($ball, 'ball') !== 0 && Arr::get($ball, 'ballType') !== 'Auto Comment Ball';
        });

        usort($balls, fn ($a, $b) => (int) Arr::get($a, 'ball', 0) <=> (int) Arr::get($b, 'ball', 0));

        return array_map(fn ($ball) => [
            'value' => Arr::get($ball, 'runsDisplay', '.'),
            'type' => Arr::get($ball, 'ballType'),
            'striker' => Arr::get($ball, 'striker'),
        ], $balls);
    }

    private function opponentTeamName(Livestream $livestream, $battingTeamId, ?string $battingTeamName): string
    {
        if ((int) $battingTeamId === (int) $livestream->team_one_id) {
            return $livestream->team_two_title;
        }

        if ((int) $battingTeamId === (int) $livestream->team_two_id) {
            return $livestream->team_one_title;
        }

        if (strcasecmp((string) $battingTeamName, (string) $livestream->team_two_title) === 0) {
            return $livestream->team_one_title;
        }

        if (strcasecmp((string) $battingTeamName, (string) $livestream->team_one_title) === 0) {
            return $livestream->team_two_title;
        }

        return $livestream->team_two_title;
    }

    private function overlayEventCacheKey(string $streamID): string
    {
        return 'livestream:'.$streamID.':overlay-event';
    }

    private function dispatchOverlayEvent(Livestream $livestream, string $type): void
    {
        $payload = [
            'type' => $type,
            'id' => $livestream->id,
            'nonce' => (string) Str::uuid(),
            'createdAt' => now()->timestamp,
            'livestream' => $livestream,
        ];

        Cache::put(
            $this->overlayEventCacheKey($livestream->live_stream_id),
            $payload,
            now()->addMinutes(10)
        );

        event(new ScoreboardUpdated($payload));
    }

    public function four($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'FOUR');

        return response()->noContent();
    }

    public function six($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'SIX');

        return response()->noContent();
    }

    public function wicket($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'WICKET');

        return response()->noContent();
    }

    public function squadOneList($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'SQUAD_ONE_LIST');

        return response()->noContent();
    }

    public function squadTwoList($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'SQUAD_TWO_LIST');

        return response()->noContent();
    }

    public function matchIntro($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'MATCH_INTRO');

        return response()->noContent();
    }

    public function inningsBreak($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'INNINGS_BREAK');

        return response()->noContent();
    }

    public function drinksBreak($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'DRINKS_BREAK');

        return response()->noContent();
    }

    public function batsmanStats($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'BATSMAN_STATS');

        return response()->noContent();
    }

    public function runnerStats($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'RUNNER_STATS');

        return response()->noContent();
    }

    public function batsmanCareer($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'BATSMAN_CAREER');

        return response()->noContent();
    }

    public function runnerCareer($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'RUNNER_CAREER');

        return response()->noContent();
    }

    public function bowlerCareer($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'BOWLER_CAREER');

        return response()->noContent();
    }

    public function partnership($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'PARTNERSHIP');

        return response()->noContent();
    }

    public function thisOver($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'THIS_OVER');

        return response()->noContent();
    }

    public function worm($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'WORM');

        return response()->noContent();
    }

    public function overByOver($streamID)
    {
        $livestream = Livestream::where('live_stream_id', $streamID)->firstOrFail();

        $this->dispatchOverlayEvent($livestream, 'OVER_BY_OVER');

        return response()->noContent();
    }
}
