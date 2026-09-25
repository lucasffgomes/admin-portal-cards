<?php

use App\Controllers\AuthController;

global $db, $router;
$auth = new AuthController($db);

// Auth Routes
$router->add('POST', '/api/login', function () use ($auth) {
    $inputData = json_decode(file_get_contents("php://input"), true) ?? $_POST;
    echo $auth->login($inputData);
});

$router->add('POST', '/api/logout', function () use ($auth) {
    echo $auth->logout();
});
