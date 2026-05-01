<?php

use App\Http\Controllers\LivestreamController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('live/{streamID}', [LivestreamController::class, 'live'])->name('livestream.live');
Route::get('live/{streamID}/scorebar-data', [LivestreamController::class, 'scorebarData'])->name('livestream.scorebar-data');
Route::get('live/{streamID}/squad/{team}', [LivestreamController::class, 'squadData'])->name('livestream.squad-data');
Route::get('live/{streamID}/current-batter-stats', [LivestreamController::class, 'currentBatterStats'])->name('livestream.current-batter-stats');
Route::get('live/{streamID}/current-runner-stats', [LivestreamController::class, 'currentRunnerStats'])->name('livestream.current-runner-stats');
Route::get('live/{streamID}/current-batter-career', [LivestreamController::class, 'currentBatterCareer'])->name('livestream.current-batter-career');
Route::get('live/{streamID}/current-runner-career', [LivestreamController::class, 'currentRunnerCareer'])->name('livestream.current-runner-career');
Route::get('live/{streamID}/current-bowler-career', [LivestreamController::class, 'currentBowlerCareer'])->name('livestream.current-bowler-career');
Route::get('live/{streamID}/worm-data', [LivestreamController::class, 'wormData'])->name('livestream.worm-data');
Route::get('live/{streamID}/partnership-data', [LivestreamController::class, 'partnershipData'])->name('livestream.partnership-data');
Route::get('live/{streamID}/this-over-data', [LivestreamController::class, 'thisOverData'])->name('livestream.this-over-data');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('createstream', 'createstream')->name('createstream');
    Route::post('createlivestream', [LivestreamController::class, 'store'])->name('livestream.store');
    Route::get('/livestream/{streamID}', [LivestreamController::class, 'show'])->name('livestream.show');
    Route::post('/livestream/four/{id}', [LivestreamController::class, 'four']);
    Route::post('/livestream/six/{id}', [LivestreamController::class, 'six']);
    Route::post('/livestream/wicket/{id}', [LivestreamController::class, 'wicket']);
    Route::post('/livestream/squad-one-list/{id}', [LivestreamController::class, 'squadOneList']);
    Route::post('/livestream/squad-two-list/{id}', [LivestreamController::class, 'squadTwoList']);
    Route::post('/livestream/match-intro/{id}', [LivestreamController::class, 'matchIntro']);
    Route::post('/livestream/innings-break/{id}', [LivestreamController::class, 'inningsBreak']);
    Route::post('/livestream/drinks-break/{id}', [LivestreamController::class, 'drinksBreak']);
    Route::post('/livestream/batsman-stats/{id}', [LivestreamController::class, 'batsmanStats']);
    Route::post('/livestream/runner-stats/{id}', [LivestreamController::class, 'runnerStats']);
    Route::post('/livestream/batsman-career/{id}', [LivestreamController::class, 'batsmanCareer']);
    Route::post('/livestream/runner-career/{id}', [LivestreamController::class, 'runnerCareer']);
    Route::post('/livestream/bowler-career/{id}', [LivestreamController::class, 'bowlerCareer']);
    Route::post('/livestream/partnership/{id}', [LivestreamController::class, 'partnership']);
    Route::post('/livestream/this-over/{id}', [LivestreamController::class, 'thisOver']);
    Route::post('/livestream/over-by-over/{id}', [LivestreamController::class, 'overByOver']);
    Route::post('/livestream/worm/{id}', [LivestreamController::class, 'worm']);

});

require __DIR__.'/settings.php';
