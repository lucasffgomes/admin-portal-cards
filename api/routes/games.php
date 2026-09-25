<?php

use App\Controllers\GameController;

global $router;

$gameCtrl = new GameController();

// Game/Editions Routes
$router->add('GET', '/api/games', function () use ($gameCtrl) {
    echo $gameCtrl->getGames();
});

$router->add('GET', '/api/editions', function () use ($gameCtrl) {
    echo $gameCtrl->getEditions();
});
